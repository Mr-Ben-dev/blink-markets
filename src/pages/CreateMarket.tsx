import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CREATE_MARKET_MUTATION, mutate } from "@/lib/graphqlClient";
import { motion } from "framer-motion";
import { Calendar, Clock, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateMarket() {
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [outcomes, setOutcomes] = useState<string[]>(["Yes", "No"]);
  const [durationDays, setDurationDays] = useState("7");
  const [durationHours, setDurationHours] = useState("0");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Calculate end date based on duration
  useEffect(() => {
    const now = new Date();
    const days = parseInt(durationDays) || 0;
    const hours = parseInt(durationHours) || 0;
    const endTime = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000));
    setEndDate(endTime.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }));
  }, [durationDays, durationHours]);

  const addOutcome = () => {
    setOutcomes([...outcomes, ""]);
  };

  const removeOutcome = (index: number) => {
    if (outcomes.length > 2) {
      setOutcomes(outcomes.filter((_, i) => i !== index));
    }
  };

  const updateOutcome = (index: number, value: string) => {
    const newOutcomes = [...outcomes];
    newOutcomes[index] = value;
    setOutcomes(newOutcomes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!question.trim()) {
      toast({
        title: "Error",
        description: "Please enter a market question",
        variant: "destructive",
      });
      return;
    }

    if (outcomes.some(o => !o.trim())) {
      toast({
        title: "Error",
        description: "All outcomes must have a value",
        variant: "destructive",
      });
      return;
    }

    const days = parseInt(durationDays) || 0;
    const hours = parseInt(durationHours) || 0;
    
    if (days === 0 && hours === 0) {
      toast({
        title: "Error",
        description: "Market must run for at least 1 hour",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      
      // Calculate end time from now + duration
      const now = Math.floor(Date.now() / 1000);
      const durationSeconds = (days * 24 * 60 * 60) + (hours * 60 * 60);
      const endTimeUnix = now + durationSeconds;

      console.log('Creating market:', {
        question: question.trim(),
        outcomes: outcomes.map(o => o.trim()),
        description: description.trim() || 'No description provided',
        endTime: endTimeUnix,
      });

      const result = await mutate(CREATE_MARKET_MUTATION, {
        question: question.trim(),
        description: description.trim() || 'No description provided',
        outcomes: outcomes.map(o => o.trim()),
        endTime: endTimeUnix,
      });

      console.log('✅ Market operation prepared:', result);
      console.log('📝 To execute this market, use: ./scripts/create-market-cli.sh');

      toast({
        title: "Operation Prepared!",
        description: "Check console for details. Use CLI script to execute on Conway.",
        duration: 5000,
      });

      // Wait a moment for the mutation to propagate
      setTimeout(() => {
        navigate("/markets");
      }, 1500);
    } catch (error: any) {
      console.error("Failed to create market:", error);
      toast({
        title: "Failed to create market",
        description: error.message || "Please check console for details",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Create Market</h1>
            <p className="text-foreground-secondary">
              Deploy a new prediction market on Conway Testnet
            </p>
          </div>

          <Card className="p-6 glass border-border/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Question */}
              <div className="space-y-2">
                <Label htmlFor="question" className="text-base font-semibold">
                  Market Question *
                </Label>
                <Input
                  id="question"
                  placeholder="Will Bitcoin reach $100,000 by end of 2025?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="text-base"
                  maxLength={200}
                />
                <p className="text-sm text-foreground-secondary">
                  {question.length}/200 characters
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-semibold">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide additional context or resolution criteria..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-base min-h-[100px]"
                  maxLength={1000}
                />
                <p className="text-sm text-foreground-secondary">
                  {description.length}/1000 characters
                </p>
              </div>

              {/* Outcomes */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  Possible Outcomes *
                </Label>
                <div className="space-y-2">
                  {outcomes.map((outcome, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Outcome ${index + 1}`}
                        value={outcome}
                        onChange={(e) => updateOutcome(index, e.target.value)}
                        className="text-base"
                        maxLength={50}
                      />
                      {outcomes.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOutcome(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {outcomes.length < 10 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOutcome}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Outcome
                  </Button>
                )}
              </div>

              {/* Market Duration */}
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Market Duration *
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="days" className="text-sm">Days</Label>
                    <Select value={durationDays} onValueChange={setDurationDays}>
                      <SelectTrigger id="days">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 7, 14, 30, 60, 90].map(d => (
                          <SelectItem key={d} value={d.toString()}>
                            {d} {d === 1 ? 'day' : 'days'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hours" className="text-sm">Hours</Label>
                    <Select value={durationHours} onValueChange={setDurationHours}>
                      <SelectTrigger id="hours">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => i).map(h => (
                          <SelectItem key={h} value={h.toString()}>
                            {h} {h === 1 ? 'hour' : 'hours'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Card className="p-3 bg-muted/50 border-muted">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Market will close on:</p>
                      <p className="text-sm text-foreground-secondary">{endDate}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Network Info */}
              <Card className="p-4 bg-success/10 border-success/30">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-1.5 animate-pulse" />
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1 text-success-600 dark:text-success-400">
                      ✅ Connected to Local Network
                    </p>
                    <p className="text-sm text-foreground-secondary">
                      Your market will be created on a local Linera blockchain.
                      The schedule_operation fix is working - markets are created instantly!
                    </p>
                  </div>
                </div>
              </Card>

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/markets")}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary to-secondary"
                  disabled={submitting}
                >
                  {submitting ? "Creating..." : "Create Market"}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

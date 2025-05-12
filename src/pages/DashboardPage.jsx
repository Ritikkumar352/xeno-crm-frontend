
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "../components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { generateCampaignMessages } from "../services/geminiService";
import { useToast } from "@/hooks/use-toast";

// Mock API data functions
const fetchStatistics = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    customers: 1284,
    campaigns: 23,
    sentMessages: 18472,
    deliveryRate: 94,
  };
};

const fetchRecentCampaigns = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return [
    {
      id: "1",
      name: "Summer Sale Promotion",
      date: "2025-05-01",
      audience: 543,
      delivered: 512,
      opened: 325,
    },
    {
      id: "2",
      name: "New Collection Announcement",
      date: "2025-04-20",
      audience: 789,
      delivered: 750,
      opened: 412,
    },
    {
      id: "3",
      name: "Customer Feedback Request",
      date: "2025-04-10",
      audience: 1021,
      delivered: 945,
      opened: 520,
    },
  ];
};

const DashboardPage = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [campaignType, setCampaignType] = useState("generic");
  const [generatedMessages, setGeneratedMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { data: statistics, isLoading: isLoadingStats } = useQuery({
    queryKey: ["dashboardStatistics"],
    queryFn: fetchStatistics,
  });
  
  const { data: recentCampaigns, isLoading: isLoadingCampaigns } = useQuery({
    queryKey: ["recentCampaigns"],
    queryFn: fetchRecentCampaigns,
  });
  
  const handleGenerateMessages = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a campaign description",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    const result = await generateCampaignMessages(prompt, campaignType);
    setIsGenerating(false);
    
    if (result.success) {
      setGeneratedMessages(result.data);
      setSelectedMessage(result.data[0]);
      toast({
        title: "Success",
        description: "AI has generated message suggestions for your campaign",
      });
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };
  
  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
  };
  
  const handleSaveMessage = () => {
    if (selectedMessage) {
      toast({
        title: "Message Saved",
        description: "The selected message has been saved to your campaign",
      });
    }
  };
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Overview of your CRM activities and AI message generator.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoadingStats ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{statistics.customers}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{statistics.campaigns}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Messages Sent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{statistics.sentMessages}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Delivery Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{statistics.deliveryRate}%</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      {/* AI Message Generator */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>AI Message Generator</CardTitle>
          <CardDescription>
            Use Google Gemini AI to generate personalized campaign messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="gemini-prompt-form">
              <Label htmlFor="prompt" className="mb-2 block">
                Describe your campaign objective
              </Label>
              <Textarea
                id="prompt"
                placeholder="E.g., 'Bring back customers who haven't shopped in 3 months' or 'Promote our new summer collection'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="campaign-type" className="mb-2 block">
                Campaign Type
              </Label>
              <Select
                value={campaignType}
                onValueChange={(value) => setCampaignType(value)}
              >
                <SelectTrigger id="campaign-type">
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="win-back">Win-back Campaign</SelectItem>
                  <SelectItem value="high-value">High-Value Customer</SelectItem>
                  <SelectItem value="new-products">New Product Launch</SelectItem>
                  <SelectItem value="generic">Generic Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleGenerateMessages} 
              disabled={isGenerating || !prompt.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <span className="mr-2 animate-spin">↻</span>
                  Generating...
                </>
              ) : (
                "Generate Message Suggestions"
              )}
            </Button>
            
            {/* Generated Messages */}
            {generatedMessages.length > 0 && (
              <div className="mt-4">
                <Label className="mb-2 block font-medium">Choose a message:</Label>
                <RadioGroup
                  value={selectedMessage}
                  onValueChange={handleSelectMessage}
                  className="space-y-3"
                >
                  {generatedMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-md cursor-pointer hover:border-brand-primary ${
                        selectedMessage === message
                          ? "border-brand-primary bg-brand-accent"
                          : ""
                      }`}
                      onClick={() => handleSelectMessage(message)}
                    >
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value={message} id={`message-${index}`} />
                        <Label
                          htmlFor={`message-${index}`}
                          className="cursor-pointer"
                        >
                          {message}
                        </Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
                <Button 
                  onClick={handleSaveMessage} 
                  className="mt-4 w-full"
                  disabled={!selectedMessage}
                >
                  Use Selected Message
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
          <CardDescription>View your latest campaign performance</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingCampaigns ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-md animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/5 mb-4"></div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentCampaigns.map((campaign) => (
                <div key={campaign.id} className="campaign-card">
                  <h3 className="font-medium text-lg">{campaign.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {new Date(campaign.date).toLocaleDateString()}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Audience:</span>{" "}
                      {campaign.audience}
                    </div>
                    <div>
                      <span className="font-medium">Delivered:</span>{" "}
                      {campaign.delivered}
                    </div>
                    <div>
                      <span className="font-medium">Opened:</span>{" "}
                      {campaign.opened}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View All Campaigns
          </Button>
        </CardFooter>
      </Card>
    </DashboardLayout>
  );
};

export default DashboardPage;

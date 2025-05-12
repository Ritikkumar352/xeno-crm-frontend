
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "../components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateCampaignMessages } from "../services/geminiService";

// Mock API data functions
const fetchSegments = async () => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return [
    { id: "1", name: "High-Value Customers", count: 145 },
    { id: "2", name: "Inactive Users", count: 328 },
    { id: "3", name: "New Customers", count: 72 }
  ];
};

const fetchCampaigns = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    {
      id: "1",
      name: "Summer Sale Promotion",
      date: "2025-05-01",
      segment: "High-Value Customers",
      audience: 145,
      sent: 145,
      delivered: 138,
      failed: 7
    },
    {
      id: "2",
      name: "Win-back Promotion",
      date: "2025-04-20",
      segment: "Inactive Users",
      audience: 328,
      sent: 328,
      delivered: 301,
      failed: 27
    },
    {
      id: "3",
      name: "Welcome Discount",
      date: "2025-04-10",
      segment: "New Customers",
      audience: 72,
      sent: 72,
      delivered: 70,
      failed: 2
    }
  ];
};

const CampaignsPage = () => {
  const { toast } = useToast();
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [selectedSegmentId, setSelectedSegmentId] = useState("");
  const [message, setMessage] = useState("");
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  
  const { data: segments, isLoading: isLoadingSegments } = useQuery({
    queryKey: ["segments"],
    queryFn: fetchSegments,
  });
  
  const { data: campaigns, isLoading: isLoadingCampaigns } = useQuery({
    queryKey: ["campaigns"],
    queryFn: fetchCampaigns,
  });
  
  const getSegmentName = (segmentId) => {
    if (!segments) return "";
    const segment = segments.find((s) => s.id === segmentId);
    return segment ? segment.name : "";
  };
  
  const getSegmentCount = (segmentId) => {
    if (!segments) return 0;
    const segment = segments.find((s) => s.id === segmentId);
    return segment ? segment.count : 0;
  };
  
  const handleCreateCampaign = async () => {
    if (!validateForm()) return;
    
    setIsCreatingCampaign(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsCreatingCampaign(false);
    
    toast({
      title: "Campaign Created",
      description: `Campaign "${campaignName}" has been created and messages are being sent.`,
    });
    
    // Reset form
    setCampaignName("");
    setSelectedSegmentId("");
    setMessage("");
  };
  
  const handleGenerateAIMessage = async () => {
    if (!selectedSegmentId) {
      toast({
        title: "Missing Information",
        description: "Please select a segment first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingMessage(true);
    
    const segmentName = getSegmentName(selectedSegmentId);
    const campaignType = segmentName.includes("High-Value")
      ? "high-value"
      : segmentName.includes("Inactive")
      ? "win-back"
      : segmentName.includes("New")
      ? "new-products"
      : "generic";
    
    const result = await generateCampaignMessages(
      `Generate a message for ${segmentName}`,
      campaignType
    );
    
    setIsGeneratingMessage(false);
    
    if (result.success && result.data.length > 0) {
      setMessage(result.data[0]);
      toast({
        title: "Message Generated",
        description: "AI has suggested a message based on your selected segment.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to generate a message. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const validateForm = () => {
    if (!campaignName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a campaign name.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!selectedSegmentId) {
      toast({
        title: "Missing Information",
        description: "Please select a segment.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a message.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Campaigns</h1>
        <p className="text-gray-600">
          Create and manage your customer communication campaigns.
        </p>
      </div>
      
      {/* Create Campaign */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Campaign</CardTitle>
          <CardDescription>
            Send personalized messages to your customer segments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div>
              <Label htmlFor="campaign-name" className="mb-2 block">
                Campaign Name
              </Label>
              <Input
                id="campaign-name"
                placeholder="E.g., Summer Promotion"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="segment" className="mb-2 block">
                Target Segment
              </Label>
              <Select
                value={selectedSegmentId}
                onValueChange={setSelectedSegmentId}
              >
                <SelectTrigger id="segment">
                  <SelectValue placeholder="Select a segment" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingSegments ? (
                    <SelectItem value="loading" disabled>
                      Loading segments...
                    </SelectItem>
                  ) : (
                    segments?.map((segment) => (
                      <SelectItem key={segment.id} value={segment.id}>
                        {segment.name} ({segment.count} customers)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              
              {selectedSegmentId && (
                <p className="text-sm text-gray-500 mt-2">
                  This campaign will target approximately {getSegmentCount(selectedSegmentId)}{" "}
                  customers.
                </p>
              )}
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="message">Message Template</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateAIMessage}
                  disabled={isGeneratingMessage || !selectedSegmentId}
                >
                  {isGeneratingMessage ? "Generating..." : "Generate with AI"}
                </Button>
              </div>
              <Textarea
                id="message"
                placeholder="Enter your message template. Use [Customer Name] to personalize."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
              />
              <p className="text-sm text-gray-500 mt-2">
                You can use [Customer Name] as a placeholder that will be replaced with the
                actual customer's name.
              </p>
            </div>
            
            <Button
              onClick={handleCreateCampaign}
              disabled={isCreatingCampaign}
              className="w-full"
            >
              {isCreatingCampaign ? "Creating Campaign..." : "Create Campaign"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Campaign History */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign History</CardTitle>
          <CardDescription>
            View the performance of your past campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingCampaigns ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-md animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/5 mb-4"></div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns?.map((campaign) => (
                <div key={campaign.id} className="campaign-card">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                    <div>
                      <h3 className="font-medium text-lg">{campaign.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(campaign.date).toLocaleDateString()} • {campaign.segment}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2 md:mt-0">
                      View Details
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-sm text-gray-500">Audience Size</p>
                      <p className="font-bold">{campaign.audience}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-sm text-gray-500">Messages Sent</p>
                      <p className="font-bold">{campaign.sent}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-sm text-gray-500">Delivered</p>
                      <p className="font-bold">{campaign.delivered}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-sm text-gray-500">Failed</p>
                      <p className="font-bold">{campaign.failed}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-primary rounded-full"
                        style={{
                          width: `${(campaign.delivered / campaign.sent) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>
                        Delivery Rate:{" "}
                        {((campaign.delivered / campaign.sent) * 100).toFixed(1)}%
                      </span>
                      <span>
                        Failure Rate:{" "}
                        {((campaign.failed / campaign.sent) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default CampaignsPage;

import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const initialCondition = { field: "purchases", operator: "greater_than", value: "" };

const SegmentsPage = () => {
  const { toast } = useToast();
  const [segments, setSegments] = useState([
    { id: "1", name: "High-Value Customers", description: "Customers who spent over ₹10,000", count: 145 },
    { id: "2", name: "Inactive Users", description: "No activity in the last 90 days", count: 328 },
    { id: "3", name: "New Customers", description: "Joined in the last 30 days", count: 72 }
  ]);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [operator, setOperator] = useState("AND");
  const [conditions, setConditions] = useState([{ ...initialCondition }]);
  const [audienceCount, setAudienceCount] = useState(null);
  const [isCreatingSegment, setIsCreatingSegment] = useState(false);
  const [isCalculatingCount, setIsCalculatingCount] = useState(false);
  
  const fieldOptions = [
    { value: "purchases", label: "Total Purchases" },
    { value: "last_order", label: "Days Since Last Order" },
    { value: "total_spent", label: "Total Amount Spent" },
    { value: "visit_count", label: "Visit Count" },
    { value: "join_date", label: "Days Since Join Date" }
  ];
  
  const operatorOptions = [
    { value: "greater_than", label: "Greater Than" },
    { value: "less_than", label: "Less Than" },
    { value: "equals", label: "Equals" },
    { value: "not_equals", label: "Not Equals" }
  ];
  
  const handleAddCondition = () => {
    setConditions([...conditions, { ...initialCondition }]);
  };
  
  const handleRemoveCondition = (index) => {
    if (conditions.length > 1) {
      const newConditions = [...conditions];
      newConditions.splice(index, 1);
      setConditions(newConditions);
    }
  };
  
  const handleConditionChange = (index, field, value) => {
    const newConditions = [...conditions];
    newConditions[index][field] = value;
    setConditions(newConditions);
  };
  
  const handlePreviewCount = async () => {
    if (!validateForm()) return;
    
    setIsCalculatingCount(true);
    
    // Simulate API call to get count
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Generate a random but realistic count
    const count = Math.floor(Math.random() * 500) + 50;
    
    setAudienceCount(count);
    setIsCalculatingCount(false);
    
    toast({
      title: "Preview Generated",
      description: `This segment would target ${count} customers.`
    });
  };
  
  const handleCreateSegment = async () => {
    if (!validateForm()) return;
    
    setIsCreatingSegment(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Add new segment
    const newSegment = {
      id: Date.now().toString(),
      name,
      description,
      count: audienceCount || Math.floor(Math.random() * 500) + 50
    };
    
    setSegments([newSegment, ...segments]);
    
    // Reset form
    setName("");
    setDescription("");
    setOperator("AND");
    setConditions([{ ...initialCondition }]);
    setAudienceCount(null);
    
    setIsCreatingSegment(false);
    
    toast({
      title: "Segment Created",
      description: `"${name}" segment has been created successfully.`
    });
  };
  
  const validateForm = () => {
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Segment name is required",
        variant: "destructive"
      });
      return false;
    }
    
    for (const condition of conditions) {
      if (!condition.value.trim()) {
        toast({
          title: "Validation Error",
          description: "All condition values must be filled",
          variant: "destructive"
        });
        return false;
      }
    }
    
    return true;
  };
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Customer Segments</h1>
        <p className="text-gray-600">
          Create and manage audience segments for targeted campaigns.
        </p>
      </div>
      
      {/* Segment Builder */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Segment</CardTitle>
          <CardDescription>
            Define rules to target specific customer groups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="segment-name" className="mb-2 block">
                  Segment Name
                </Label>
                <Input
                  id="segment-name"
                  placeholder="E.g., High-Value Customers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="segment-description" className="mb-2 block">
                  Description (Optional)
                </Label>
                <Input
                  id="segment-description"
                  placeholder="E.g., Customers who spent over ₹10,000"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label className="mb-2 block">Logic Operator</Label>
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant={operator === "AND" ? "default" : "outline"}
                  onClick={() => setOperator("AND")}
                >
                  AND
                </Button>
                <Button
                  type="button"
                  variant={operator === "OR" ? "default" : "outline"}
                  onClick={() => setOperator("OR")}
                >
                  OR
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {operator === "AND"
                  ? "Customer must match ALL conditions"
                  : "Customer must match ANY condition"}
              </p>
            </div>
            
            <div className="segment-builder">
              <h3 className="font-medium mb-3">Conditions</h3>
              
              <div className="condition-group">
                {conditions.map((condition, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 items-end"
                  >
                    <div>
                      <Label className="mb-1 block text-sm">Field</Label>
                      <Select
                        value={condition.field}
                        onValueChange={(value) =>
                          handleConditionChange(index, "field", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="mb-1 block text-sm">Operator</Label>
                      <Select
                        value={condition.operator}
                        onValueChange={(value) =>
                          handleConditionChange(index, "operator", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent>
                          {operatorOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="mb-1 block text-sm">Value</Label>
                      <Input
                        type="text"
                        placeholder="Enter value"
                        value={condition.value}
                        onChange={(e) =>
                          handleConditionChange(index, "value", e.target.value)
                        }
                      />
                    </div>
                    
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveCondition(index)}
                        disabled={conditions.length === 1}
                      >
                        <span className="sr-only">Remove condition</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCondition}
                  className="mt-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Condition
                </Button>
              </div>
            </div>
            
            {audienceCount !== null && (
              <div className="bg-brand-accent p-4 rounded-lg text-center">
                <p className="font-medium mb-1">Estimated audience size:</p>
                <p className="text-2xl font-bold text-brand-primary">
                  {audienceCount} customers
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviewCount}
                disabled={isCalculatingCount}
              >
                {isCalculatingCount ? "Calculating..." : "Preview Audience Size"}
              </Button>
              <Button
                type="button"
                onClick={handleCreateSegment}
                disabled={isCreatingSegment}
              >
                {isCreatingSegment ? "Creating..." : "Create Segment"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Existing Segments */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Segments</CardTitle>
          <CardDescription>
            View and manage your created audience segments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {segments.map((segment) => (
              <div
                key={segment.id}
                className="border rounded-lg p-4 hover:shadow-md transition"
              >
                <h3 className="font-medium text-lg mb-1">{segment.name}</h3>
                <p className="text-sm text-gray-500 mb-3">
                  {segment.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {segment.count} customers
                  </span>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default SegmentsPage;

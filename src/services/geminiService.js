const MOCK_DELAY = 1500; 

const mockGenerateResponse = async (prompt, campaignType) => {
  

   const API_KEY = process.env.GEMINI_API_KEY;
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  

  const validCampaignType = (typeof campaignType === 'string' && campaignType) ? campaignType : "generic";
  
  if (validCampaignType === "win-back") {
    return [
      `Hi [Customer Name], we miss you! It's been a while since your last visit. Enjoy 15% off your next purchase with code WELCOME15.`,
      `Hello [Customer Name]! We noticed you haven't shopped with us recently. Come back and discover our latest collection with a special 10% discount just for you.`,
      `[Customer Name], we'd love to see you again! Return today and get exclusive access to our new arrivals plus free shipping on orders over $50.`,
      `We haven't seen you in a while, [Customer Name]! Come back and enjoy a special welcome-back gift with your next order.`,
      `Missing your great taste, [Customer Name]! Return today and we'll add a free gift to your next purchase.`
    ];
  } else if (validCampaignType === "high-value") {
    return [
      `[Customer Name], as one of our most valued customers, we're giving you early access to our premium collection before anyone else!`,
      `Thank you for your continued support, [Customer Name]! Enjoy a complimentary gift with your next purchase as a token of our appreciation.`,
      `Exclusive offer for our VIP [Customer Name]! Unlock 20% off your favorite items this weekend only. Shop now!`,
      `As a premium customer, [Customer Name], we've reserved special items just for you. Check out your personalized recommendations.`,
      `[Customer Name], your loyalty deserves to be rewarded! Enjoy double points on all purchases this month.`
    ];
  } else if (validCampaignType === "new-products") {
    return [
      `[Customer Name], be the first to explore our latest products! Fresh arrivals just hit our shelves and they're perfect for you.`,
      `New and exciting products alert, [Customer Name]! Check out what we've just added to our collection, based on your previous preferences.`,
      `Just launched: Our newest collection is here, [Customer Name]! Take a look at these items we think you'll love based on your style.`,
      `[Customer Name], our design team has been busy! Explore our brand-new product line before they sell out.`,
      `Hot off the press: New arrivals we think you'll love, [Customer Name]. Based on your taste, these new items are must-sees!`
    ];
  } else if (validCampaignType === "holiday") {
    return [
      `Happy Holidays, [Customer Name]! Celebrate the season with 15% off your entire purchase.`,
      `'Tis the season for giving, [Customer Name]! Discover our curated holiday gift guide perfect for everyone on your list.`,
      `[Customer Name], make this holiday special with our limited-edition festive collection. Order now for guaranteed delivery before the holidays!`,
      `Season's Greetings, [Customer Name]! Unwrap special holiday offers exclusively for our loyal customers.`,
      `Celebrate in style, [Customer Name]! Our holiday collection has everything you need for a magical season.`
    ];
  } else if (validCampaignType === "seasonal") {
    return [
      `Summer is here, [Customer Name]! Beat the heat with our new seasonal collection.`,
      `[Customer Name], embrace the fall season with our cozy autumn essentials - perfect for the changing weather.`,
      `Winter wonderland awaits, [Customer Name]! Stay warm with our specially curated cold-weather favorites.`,
      `Spring has sprung, [Customer Name]! Refresh your collection with our bright and breezy seasonal items.`,
      `[Customer Name], the seasons are changing and so should your wardrobe! Check out our transitional must-haves.`
    ];
  } else if (validCampaignType === "flash-sale") {
    return [
      `FLASH SALE ALERT! [Customer Name], you have 24 hours to save 30% on selected items. Hurry!`,
      `[Customer Name], don't miss out! Our flash sale is live for the next 48 hours only.`,
      `Quick, [Customer Name]! Our surprise flash sale ends at midnight. Grab your favorites at unbelievable prices.`,
      `Lightning deals for [Customer Name]! For the next few hours, enjoy exclusive discounts on our premium selection.`,
      `[Customer Name], our flash sale is TOO GOOD to miss! Limited time, limited stock - shop now!`
    ];
  } else {
    // Generic messages as fallback
    return [
      `Hello [Customer Name], we have a special offer just for you! Use code SPECIAL10 for 10% off your next purchase.`,
      `[Customer Name], we've picked some items we think you'll love. Check them out in our latest collection!`,
      `Thanks for being a loyal customer, [Customer Name]! We've prepared something special just for you.`,
      `[Customer Name], discover what's new and exciting in our store this week. We've updated our collection just for you.`,
      `Special announcement for [Customer Name]! We're excited to share our latest updates and exclusive offers with you.`
    ];
  }
};

export const generateCampaignMessages = async (prompt, campaignType) => {
  try {
    console.log("Generating campaign messages:", { prompt, campaignType });
    
    // Always generate messages regardless of prompt content
    // But still validate and log for debugging purposes
    if (!prompt || prompt.trim() === '') {
      console.log("Empty prompt provided, but continuing with generation");
    }
    
    const messages = await mockGenerateResponse(prompt, campaignType);
    console.log("Successfully generated messages:", messages);
    return { success: true, data: messages };
  } catch (error) {
    // Failsafe: Even if there's an error, return generic messages
    console.error("Error occurred but returning fallback messages:", error);
    return { 
      success: true, 
      data: [
        `Hello [Customer Name], thank you for being our customer!`,
        `[Customer Name], we appreciate your business and wanted to share this special message.`,
        `We value your support, [Customer Name]! Here's something we thought you might enjoy.`
      ]
    };
  }
};

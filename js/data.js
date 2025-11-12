// Mock Database for the Support Portal

const articles = [
    // LevelPlay
    { id: 1, category: 'LevelPlay', section: 'SDK', title: 'Getting Started with LevelPlay', likes: 215, views: 3500, updated: 'Nov 1, 2025', content: 'Your first steps to integrating and configuring the LevelPlay mediation platform. This guide covers initialization and basic setup. To begin, download the latest SDK from our developer portal and follow the platform-specific instructions for either iOS or Android.' },
    { id: 2, category: 'LevelPlay', section: 'Platform', title: 'How to Add Ad Sources', likes: 180, views: 2800, updated: 'Oct 28, 2025', content: 'A comprehensive guide to adding and managing different ad network sources within the LevelPlay platform. This includes setting up bidding networks and traditional waterfall instances.' },
    { id: 3, category: 'LevelPlay', section: 'Platform', title: 'Understanding Mediation Groups', likes: 155, views: 2400, updated: 'Oct 15, 2025', content: 'Learn how to optimize your ad revenue by using targeted mediation groups and waterfalls. You can segment users by country, device, or other parameters to maximize eCPM.' },
    { id: 4, category: 'LevelPlay', section: 'General & Account', title: 'LevelPlay Account Security', likes: 95, views: 1500, updated: 'Oct 10, 2025', content: 'Best practices for keeping your LevelPlay account secure, including enabling Two-Factor Authentication (2FA) and managing user roles and permissions.' },
    { id: 5, category: 'LevelPlay', section: 'SDK', title: 'Advanced SDK Features', likes: 130, views: 1900, updated: 'Nov 5, 2025', content: 'Explore advanced features of the SDK, including server-side-to-server callbacks, segmentation, and custom parameters for A/B testing.' },

    // IronSource
    { id: 6, category: 'IronSource', section: 'SDK', title: 'Integrating the IronSource SDK', likes: 198, views: 3200, updated: 'Nov 10, 2025', content: 'Step-by-step instructions for a successful SDK integration on iOS and Android. This article covers dependencies and required adapter initializations.' },
    { id: 7, category: 'IronSource', section: 'Platform', title: 'IronSource Reporting APIs', likes: 140, views: 2600, updated: 'Oct 25, 2025', content: 'How to use the Reporting APIs to pull performance data into your own systems. We provide examples for common API endpoints and authentication methods.' },
    { id: 8, category: 'IronSource', section: 'General & Account', title: 'Payment and Invoicing', likes: 110, views: 2000, updated: 'Oct 5, 2025', content: 'Everything you need to know about payment cycles, invoices, and financial settings in your IronSource account. Find out how to submit your tax forms.' },

    // UnityAds
    { id: 9, category: 'UnityAds', section: 'Platform', title: 'Best Practices for UnityAds Placements', likes: 250, views: 4500, updated: 'Nov 8, 2025', content: 'Tips for maximizing user engagement and revenue with rewarded and interstitial ad placements. Learn where to place ads to improve the user experience.' },
    { id: 10, category: 'UnityAds', section: 'SDK', title: 'Migrating to the new UnityAds SDK', likes: 160, views: 2900, updated: 'Oct 22, 2025', content: 'A guide for developers migrating from older versions of the UnityAds SDK. This includes API changes and new required frameworks.' },
    { id: 11, category: 'UnityAds', section: 'General & Account', title: 'Unity Dashboard Overview', likes: 120, views: 2100, updated: 'Oct 1, 2025', content: 'An overview of the Unity Dashboard for managing your ad monetization, including project settings and ad unit configuration.' },

    // Tapjoy
    { id: 12, category: 'Tapjoy', section: 'Platform', title: 'Setting Up a Tapjoy Offerwall', likes: 175, views: 3100, updated: 'Nov 3, 2025', content: 'A guide to implementing and customizing the Tapjoy Offerwall for your app. This includes setting up virtual currency and managing placements.' },
    { id: 13, category: 'Tapjoy', section: 'SDK', title: 'Tapjoy SDK Integration for iOS', likes: 115, views: 2300, updated: 'Oct 18, 2025', content: 'Detailed instructions for integrating the Tapjoy SDK into your iOS project using Cocoapods or manual installation.' },
    { id: 14, category: 'Tapjoy', section: 'General & Account', title: 'Analyzing Tapjoy Performance', likes: 105, views: 1800, updated: 'Sep 25, 2025', content: 'How to use the Tapjoy dashboard to analyze user engagement and revenue. Learn about cohorts and user segmentation.' },
    
    // More articles for pagination and display
    { id: 15, category: 'LevelPlay', section: 'SDK', title: 'Debugging Common SDK Issues', likes: 90, views: 1600, updated: 'Sep 20, 2025', content: 'A troubleshooting guide for common issues encountered during SDK integration. Check logs for common error messages.' },
    { id: 16, category: 'UnityAds', section: 'SDK', title: 'Implementing Rewarded Ads', likes: 220, views: 4000, updated: 'Nov 11, 2025', content: 'A detailed walkthrough on how to implement rewarded video ads with Unity. This includes handling callbacks for success and failure.' },
    { id: 17, category: 'LevelPlay', section: 'Platform', title: 'A/B Testing Best Practices', likes: 145, views: 2500, updated: 'Oct 29, 2025', content: 'Learn how to effectively use A/B testing to optimize your ad monetization strategy. Create variants for your mediation groups.' },
    { id: 18, category: 'IronSource', section: 'Platform', title: 'Setting Up Ad Quality', likes: 135, views: 2450, updated: 'Oct 21, 2025', content: 'Control the quality of ads shown in your app with IronSource Ad Quality tools. Block specific advertisers or categories.' },
    { id: 19, category: 'UnityAds', section: 'Platform', title: 'Understanding eCPM', likes: 190, views: 3300, updated: 'Nov 9, 2025', content: 'A deep dive into what eCPM is and how it affects your revenue. Learn the difference between CPM and eCPM.' },
    { id: 20, category: 'Tapjoy', section: 'Platform', title: 'Customizing Offerwall Currency', likes: 125, views: 2200, updated: 'Oct 12, 2025', content: 'Learn how to set up and manage virtual currency for your Tapjoy Offerwall. This includes setting exchange rates and currency sale events.' }
];

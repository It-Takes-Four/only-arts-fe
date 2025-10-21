import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../../src/components/ui/card";
import { Badge } from "../../../src/components/ui/badge";
import { 
  Users, 
  Building2, 
  Target, 
  Heart, 
  Database, 
  Share2, 
  DollarSign, 
  TrendingUp,
  Palette,
  Shield,
  Zap,
  Globe
} from "lucide-react";
import StaticGradient from "@/components/blocks/Backgrounds/StaticGradient/StaticGradient";

const businessModelCanvas = {
  // Traditional 3x3 grid layout
  grid: [
    // Row 1: Key Partners, Key Activities, Value Propositions, Customer Relationships, Customer Segments
    [
      {
        id: "key-partners",
        title: "Key Partners",
        icon: Users,
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-50 dark:bg-blue-950/20",
        borderColor: "border-blue-200 dark:border-blue-800",
        items: [
          "RainbowKit & WalletConnect",
          "Blockchain Networks (Ethereum, Polygon)",
          "Digital Artists & Collectors",
          "Web3 Technology Partners"
        ]
      },
      {
        id: "key-activities", 
        title: "Key Activities",
        icon: Zap,
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-50 dark:bg-blue-950/20",
        borderColor: "border-blue-200 dark:border-blue-800",
        items: [
          "NFT Minting & Management",
          "Artist Studio Development",
          "Community Building",
          "Blockchain Integration"
        ]
      },
      {
        id: "value-propositions",
        title: "Value Propositions", 
        icon: Target,
        color: "from-orange-500 to-amber-500",
        bgColor: "bg-orange-50 dark:bg-orange-950/20",
        borderColor: "border-orange-200 dark:border-orange-800",
        items: [
          "Easy NFT Creation for Artists",
          "Secure Web3 Transactions",
          "Direct Artist Monetization",
          "Decentralized Art Marketplace"
        ]
      },
      {
        id: "customer-relationships",
        title: "Customer Relationships",
        icon: Heart,
        color: "from-yellow-500 to-orange-500", 
        bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
        borderColor: "border-yellow-200 dark:border-yellow-800",
        items: [
          "Self-Service Artist Tools",
          "Community-Driven Discovery",
          "Direct Artist-Collector Connection",
          "Educational Web3 Resources"
        ]
      },
      {
        id: "customer-segments",
        title: "Customer Segments",
        icon: Users,
        color: "from-yellow-500 to-orange-500",
        bgColor: "bg-yellow-50 dark:bg-yellow-950/20", 
        borderColor: "border-yellow-200 dark:border-yellow-800",
        items: [
          "Digital Artists (Emerging & Established)",
          "NFT Collectors & Investors",
          "Web3 Art Enthusiasts",
          "Crypto-Native Creators"
        ]
      }
    ],
    // Row 2: Key Resources, Channels
    [
      {
        id: "key-resources",
        title: "Key Resources",
        icon: Database,
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-50 dark:bg-blue-950/20",
        borderColor: "border-blue-200 dark:border-blue-800",
        items: [
          "Smart Contract Infrastructure",
          "Artist Community & Content",
          "Web3 Development Team",
          "Blockchain Technology Stack"
        ]
      },
      {
        id: "channels",
        title: "Channels",
        icon: Share2,
        color: "from-yellow-500 to-orange-500",
        bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
        borderColor: "border-yellow-200 dark:border-yellow-800",
        items: [
          "OnlyArts Web Platform",
          "Artist Studio Dashboard",
          "Social Media & Community",
          "Web3 Wallet Integration"
        ]
      }
    ],
    // Row 3: Cost Structure, Revenue Streams
    [
      {
        id: "cost-structure",
        title: "Cost Structure",
        icon: DollarSign,
        color: "from-green-500 to-emerald-500",
        bgColor: "bg-green-50 dark:bg-green-950/20",
        borderColor: "border-green-200 dark:border-green-800",
        items: [
          "Development Team & Infrastructure",
          "Blockchain Gas Fees & Operations",
          "Artist Community Building",
          "Platform Maintenance & Security"
        ]
      },
      {
        id: "revenue-streams",
        title: "Revenue Streams",
        icon: TrendingUp,
        color: "from-green-500 to-emerald-500",
        bgColor: "bg-green-50 dark:bg-green-950/20",
        borderColor: "border-green-200 dark:border-green-800",
        items: [
          "Transaction Fees (2-5% per sale)",
          "Artist Verification Premium",
          "Advanced Analytics Subscriptions",
          "Partnership & Licensing Revenue"
        ]
      }
    ]
  ]
};

const revenueStreams = [
  {
    title: "Transaction Fees",
    description: "Percentage fee on each collection and artwork purchase",
    percentage: "2-5%",
    icon: DollarSign,
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Premium Features",
    description: "Advanced analytics, artist verification, priority support",
    percentage: "15-25%",
    icon: Shield,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Subscription Services",
    description: "Monthly/yearly subscriptions for enhanced features",
    percentage: "30-40%",
    icon: Users,
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Partnership Revenue",
    description: "Technology licensing and white-label solutions",
    percentage: "20-30%",
    icon: Building2,
    color: "from-orange-500 to-red-500"
  }
];

const valuePropositions = [
  {
    title: "For Artists",
    icon: Palette,
    benefits: [
      "Easy NFT Creation without technical complexity",
      "Direct Monetization with wallet-to-wallet payments",
      "Professional Tools with analytics and management",
      "Community Building and networking opportunities"
    ]
  },
  {
    title: "For Collectors",
    icon: Shield,
    benefits: [
      "Authentic Art with blockchain-verified ownership",
      "Secure Transactions through smart contracts",
      "Investment Opportunities with potential appreciation",
      "Social Features for following and sharing"
    ]
  },
  {
    title: "For Platform",
    icon: Globe,
    benefits: [
      "Web3 Innovation with cutting-edge technology",
      "User-friendly Interface making Web3 accessible",
      "Scalable Architecture for growth and expansion",
      "Community-driven governance and decision making"
    ]
  }
];

export function BusinessModelCanvasPage() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-auto">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <StaticGradient />
      </div>
      
      {/* Content */}
      <div className="relative z-10 pt-16 min-h-full">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 xl:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              OnlyArts
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                {" "}Business Model Canvas
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A comprehensive overview of how OnlyArts creates, delivers, and captures value in the Web3 digital art ecosystem.
            </p>
          </div>

          {/* Business Model Canvas - Traditional 3x3 Grid Layout */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">OnlyArts Business Model Canvas</h2>
            
            {/* Traditional BMC Layout - Proper Grid Structure */}
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3" >
                {/* Column 1: Key Partners (tall - spans 2 rows) */}
                <div className="">
                  <Card className={`${businessModelCanvas.grid[0][0].bgColor} ${businessModelCanvas.grid[0][0].borderColor} border-2 h-full hover:shadow-md transition-shadow`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-md bg-gradient-to-r ${businessModelCanvas.grid[0][0].color} shadow-sm`}>
                          {React.createElement(businessModelCanvas.grid[0][0].icon, { className: "h-4 w-4 text-white" })}
                        </div>
                        <CardTitle className="text-sm font-semibold leading-tight">{businessModelCanvas.grid[0][0].title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-1">
                        {businessModelCanvas.grid[0][0].items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-current mt-1.5 flex-shrink-0" />
                            <span className="leading-tight">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Column 2: Key Activities (top half) + Key Resources (bottom half) */}
                <div className="flex flex-col gap-3">
                  <Card className={`${businessModelCanvas.grid[0][1].bgColor} ${businessModelCanvas.grid[0][1].borderColor} border-2 hover:shadow-md transition-shadow`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-md bg-gradient-to-r ${businessModelCanvas.grid[0][1].color} shadow-sm`}>
                          {React.createElement(businessModelCanvas.grid[0][1].icon, { className: "h-4 w-4 text-white" })}
                        </div>
                        <CardTitle className="text-sm font-semibold leading-tight">{businessModelCanvas.grid[0][1].title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-1">
                        {businessModelCanvas.grid[0][1].items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-current mt-1.5 flex-shrink-0" />
                            <span className="leading-tight">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className={`${businessModelCanvas.grid[1][0].bgColor} ${businessModelCanvas.grid[1][0].borderColor} border-2 hover:shadow-md transition-shadow`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-md bg-gradient-to-r ${businessModelCanvas.grid[1][0].color} shadow-sm`}>
                          {React.createElement(businessModelCanvas.grid[1][0].icon, { className: "h-4 w-4 text-white" })}
                        </div>
                        <CardTitle className="text-sm font-semibold leading-tight">{businessModelCanvas.grid[1][0].title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-1">
                        {businessModelCanvas.grid[1][0].items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-current mt-1.5 flex-shrink-0" />
                            <span className="leading-tight">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Column 3: Value Propositions (tall - spans 2 rows) */}
                <div>
                  <Card className={`${businessModelCanvas.grid[0][2].bgColor} ${businessModelCanvas.grid[0][2].borderColor} border-2 h-full hover:shadow-md transition-shadow`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-md bg-gradient-to-r ${businessModelCanvas.grid[0][2].color} shadow-sm`}>
                          {React.createElement(businessModelCanvas.grid[0][2].icon, { className: "h-4 w-4 text-white" })}
                        </div>
                        <CardTitle className="text-sm font-semibold leading-tight">{businessModelCanvas.grid[0][2].title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-1">
                        {businessModelCanvas.grid[0][2].items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-current mt-1.5 flex-shrink-0" />
                            <span className="leading-tight">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Column 4: Customer Relationships (top half) + Channels (bottom half) */}
                <div className="flex flex-col gap-3">
                  <Card className={`${businessModelCanvas.grid[0][3].bgColor} ${businessModelCanvas.grid[0][3].borderColor} border-2 hover:shadow-md transition-shadow`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-md bg-gradient-to-r ${businessModelCanvas.grid[0][3].color} shadow-sm`}>
                          {React.createElement(businessModelCanvas.grid[0][3].icon, { className: "h-4 w-4 text-white" })}
                        </div>
                        <CardTitle className="text-sm font-semibold leading-tight">{businessModelCanvas.grid[0][3].title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-1">
                        {businessModelCanvas.grid[0][3].items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-current mt-1.5 flex-shrink-0" />
                            <span className="leading-tight">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className={`${businessModelCanvas.grid[1][1].bgColor} ${businessModelCanvas.grid[1][1].borderColor} border-2 hover:shadow-md transition-shadow`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-md bg-gradient-to-r ${businessModelCanvas.grid[1][1].color} shadow-sm`}>
                          {React.createElement(businessModelCanvas.grid[1][1].icon, { className: "h-4 w-4 text-white" })}
                        </div>
                        <CardTitle className="text-sm font-semibold leading-tight">{businessModelCanvas.grid[1][1].title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-1">
                        {businessModelCanvas.grid[1][1].items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-current mt-1.5 flex-shrink-0" />
                            <span className="leading-tight">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Column 5: Customer Segments (tall - spans 2 rows) */}
                <div>
                  <Card className={`${businessModelCanvas.grid[0][4].bgColor} ${businessModelCanvas.grid[0][4].borderColor} border-2 h-full hover:shadow-md transition-shadow`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-md bg-gradient-to-r ${businessModelCanvas.grid[0][4].color} shadow-sm`}>
                          {React.createElement(businessModelCanvas.grid[0][4].icon, { className: "h-4 w-4 text-white" })}
                        </div>
                        <CardTitle className="text-sm font-semibold leading-tight">{businessModelCanvas.grid[0][4].title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-1">
                        {businessModelCanvas.grid[0][4].items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-current mt-1.5 flex-shrink-0" />
                            <span className="leading-tight">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Bottom Row: Cost Structure, Revenue Streams (full width) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                {businessModelCanvas.grid[2].map((section, index) => (
                  <Card key={section.id} className={`${section.bgColor} ${section.borderColor} border-2 h-full hover:shadow-md transition-shadow`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-md bg-gradient-to-r ${section.color} shadow-sm`}>
                          {React.createElement(section.icon, { className: "h-4 w-4 text-white" })}
                        </div>
                        <CardTitle className="text-sm font-semibold leading-tight">{section.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-1">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-current mt-1.5 flex-shrink-0" />
                            <span className="leading-tight">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Canvas Description */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-center text-muted-foreground">
                OnlyArts' business model focuses on empowering digital artists through Web3 technology, creating a decentralized marketplace where creators can mint, manage, and monetize their digital art with blockchain security and direct peer-to-peer transactions.
              </p>
            </div>
          </div>

          {/* Revenue Streams */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Revenue Streams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {revenueStreams.map((stream, index) => (
                <Card key={stream.title} className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${stream.color}`}>
                          <stream.icon className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle>{stream.title}</CardTitle>
                      </div>
                      <Badge variant="outline" className="text-primary">
                        {stream.percentage}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{stream.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Value Propositions */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Value Propositions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {valuePropositions.map((proposition, index) => (
                <Card key={proposition.title} className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-purple-400">
                        <proposition.icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle>{proposition.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {proposition.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="text-sm flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Competitive Advantages */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Competitive Advantages</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Technology Advantages</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Web3 Native - Built specifically for blockchain</li>
                      <li>• Multi-chain Support - Cross-blockchain compatibility</li>
                      <li>• User-friendly Interface - Complex Web3 made simple</li>
                      <li>• Scalable Architecture - Designed for growth</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Business Model Advantages</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Low Barriers to Entry - Easy artist onboarding</li>
                      <li>• Direct Monetization - Artists receive payments directly</li>
                      <li>• Transparent Fees - Clear and fair transaction costs</li>
                      <li>• Sustainable Growth - Long-term platform development</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

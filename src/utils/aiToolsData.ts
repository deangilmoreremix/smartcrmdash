import { Icons } from './icons';
import type { IconProps } from './icons';

// Define AI tool types
export interface AITool {
  name: string;
  tool: string;
  icon: React.FC<IconProps>;
  category: string;
  description?: string;
}

// AI Tools organized by category
export const aiTools: AITool[] = [
  // Core AI Tools (9 tools)
  { name: 'Email Analysis', tool: 'email-analysis', icon: Icons.Mail, category: 'Core AI Tools', description: 'Analyze email content and suggest improvements' },
  { name: 'Meeting Summarizer', tool: 'meeting-summarizer', icon: Icons.Video, category: 'Core AI Tools', description: 'Generate concise meeting summaries' },
  { name: 'Proposal Generator', tool: 'proposal-generator', icon: Icons.FileText, category: 'Core AI Tools', description: 'Create professional sales proposals' },
  { name: 'Call Script Generator', tool: 'call-script', icon: Icons.Phone, category: 'Core AI Tools', description: 'Generate effective call scripts' },
  { name: 'Subject Line Optimizer', tool: 'subject-optimizer', icon: Icons.Mail, category: 'Core AI Tools', description: 'Create high-converting email subject lines' },
  { name: 'Competitor Analysis', tool: 'competitor-analysis', icon: Icons.Shield, category: 'Core AI Tools', description: 'Analyze competitor strengths and weaknesses' },
  { name: 'Market Trends', tool: 'market-trends', icon: Icons.TrendingUp, category: 'Core AI Tools', description: 'Identify emerging market trends' },
  { name: 'Sales Insights', tool: 'sales-insights', icon: Icons.BarChart3, category: 'Core AI Tools', description: 'Gain insights from sales data' },
  { name: 'Sales Forecast', tool: 'sales-forecast', icon: Icons.LineChart, category: 'Core AI Tools', description: 'Predict future sales performance' },

  // Communication (4 tools)
  { name: 'Email Composer', tool: 'email-composer', icon: Icons.Mail, category: 'Communication', description: 'Create compelling email content' },
  { name: 'Objection Handler', tool: 'objection-handler', icon: Icons.MessageSquare, category: 'Communication', description: 'Generate responses to common sales objections' },
  { name: 'Email Response', tool: 'email-response', icon: Icons.Mail, category: 'Communication', description: 'Draft professional email responses' },
  { name: 'Voice Tone Optimizer', tool: 'voice-tone', icon: Icons.Volume2, category: 'Communication', description: 'Adjust content for the right tone of voice' },

  // Customer & Content (3 tools)
  { name: 'Customer Persona', tool: 'customer-persona', icon: Icons.User, category: 'Customer & Content', description: 'Create detailed customer personas' },
  { name: 'Visual Content Generator', tool: 'visual-content', icon: Icons.Image, category: 'Customer & Content', description: 'Generate ideas for visual content' },
  { name: 'Meeting Agenda', tool: 'meeting-agenda', icon: Icons.Calendar, category: 'Customer & Content', description: 'Create structured meeting agendas' },

  // Advanced Features (5 tools)
  { name: 'AI Assistant', tool: 'ai-assistant', icon: Icons.Bot, category: 'Advanced Features', description: 'Get help with various sales tasks' },
  { name: 'Vision Analyzer', tool: 'vision-analyzer', icon: Icons.Eye, category: 'Advanced Features', description: 'Analyze images and visual content' },
  { name: 'Image Generator', tool: 'image-generator', icon: Icons.Camera, category: 'Advanced Features', description: 'Create AI-generated images' },
  { name: 'Semantic Search', tool: 'semantic-search', icon: Icons.Search, category: 'Advanced Features', description: 'Find relevant information using natural language' },
  { name: 'Function Assistant', tool: 'function-assistant', icon: Icons.Code, category: 'Advanced Features', description: 'Get help with specific functional tasks' },

  // Real-time Features (6 tools)
  { name: 'Streaming Chat', tool: 'streaming-chat', icon: Icons.MessageCircle, category: 'Real-time Features', description: 'Real-time AI chat responses' },
  { name: 'Form Validation', tool: 'form-validation', icon: Icons.CheckSquare, category: 'Real-time Features', description: 'Validate form input in real-time' },
  { name: 'Live Deal Analysis', tool: 'live-deal-analysis', icon: Icons.Activity, category: 'Real-time Features', description: 'Get real-time insights on active deals' },
  { name: 'Instant Response', tool: 'instant-response', icon: Icons.Zap, category: 'Real-time Features', description: 'Generate immediate responses to customer inquiries' },
  { name: 'Real-time Email Composer', tool: 'realtime-email', icon: Icons.Mail, category: 'Real-time Features', description: 'Draft emails with real-time AI assistance' },
  { name: 'Voice Analysis Real-time', tool: 'voice-analysis', icon: Icons.Mic, category: 'Real-time Features', description: 'Analyze speech patterns in real-time' },

  // Reasoning Generators (5 tools)
  { name: 'Reasoning Email', tool: 'reasoning-email', icon: Icons.Brain, category: 'Reasoning Generators', description: 'Generate emails with complex reasoning' },
  { name: 'Reasoning Proposal', tool: 'reasoning-proposal', icon: Icons.FileText, category: 'Reasoning Generators', description: 'Create proposals with detailed reasoning' },
  { name: 'Reasoning Script', tool: 'reasoning-script', icon: Icons.Phone, category: 'Reasoning Generators', description: 'Generate call scripts with advanced reasoning' },
  { name: 'Reasoning Objection', tool: 'reasoning-objection', icon: Icons.AlertTriangle, category: 'Reasoning Generators', description: 'Handle objections with strategic reasoning' },
  { name: 'Reasoning Social', tool: 'reasoning-social', icon: Icons.Users, category: 'Reasoning Generators', description: 'Create social content with persuasive reasoning' }
];

// Group tools by category
export const getToolsByCategory = () => {
  const categories: Record<string, AITool[]> = {};
  
  aiTools.forEach(tool => {
    if (!categories[tool.category]) {
      categories[tool.category] = [];
    }
    categories[tool.category].push(tool);
  });
  
  return categories;
};

// Find a tool by its ID
export const findToolById = (toolId: string): AITool | undefined => {
  return aiTools.find(tool => tool.tool === toolId);
};

export default aiTools;

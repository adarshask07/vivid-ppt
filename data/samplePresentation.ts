import type { Presentation } from "../types/slide-schema";

export const SAMPLE_PRESENTATION: Presentation = {
  id: "pres-001",
  metadata: {
    title: "Q3 2024 Financial Report",
    description: "Quarterly financial performance and growth metrics",
    author: "Finance Team",
    company: "Acme Corporation",
    createdAt: "2024-10-01T00:00:00Z",
    updatedAt: "2024-10-15T00:00:00Z",
    tags: ["finance", "quarterly", "report"],
  },
  settings: {
    aspectRatio: "16:9",
    width: 960,
    height: 540,
    defaultTransition: {
      type: "fade",
      duration: 300,
    },
  },
  theme: {
    id: "corporate-dark",
    name: "Corporate Dark",
    colors: {
      primary: "#3b82f6",
      secondary: "#8b5cf6",
      accent: "#06b6d4",
      background: "#0f172a",
      surface: "#1e293b",
      text: {
        primary: "#f8fafc",
        secondary: "#94a3b8",
        muted: "#64748b",
        inverse: "#0f172a",
      },
      success: "#22c55e",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
    typography: {
      headingFont: "Inter, system-ui, sans-serif",
      bodyFont: "Inter, system-ui, sans-serif",
      codeFont: "JetBrains Mono, monospace",
    },
    spacing: {
      unit: 8,
      margins: { top: 60, right: 60, bottom: 60, left: 60 },
    },
  },
  slides: [
    // Slide 1: Title Slide
    {
      id: "slide-1",
      name: "Title",
      layoutType: "title-subtitle",
      background: {
        type: "gradient",
        gradient: {
          type: "linear",
          angle: 135,
          stops: [
            { color: "#0f172a", position: 0 },
            { color: "#1e293b", position: 50 },
            { color: "#0f172a", position: 100 },
          ],
        },
      },
      elements: [
        {
          id: "title-shape",
          type: "shape",
          variant: "circle",
          bounds: { x: -100, y: -100, width: 400, height: 400 },
          fill: {
            type: "gradient",
            gradient: {
              type: "radial",
              centerX: "50%",
              centerY: "50%",
              radius: "50%",
              stops: [
                { color: "#3b82f6", position: 0 },
                { color: "transparent", position: 100 },
              ],
            },
          },
          effects: { opacity: 0.3 },
          zIndex: 0,
        },
        {
          id: "title-1",
          type: "text",
          bounds: { x: 60, y: 180, width: 840, height: 100 },
          content: "Q3 2024 Financial Results",
          semanticStyle: "h1",
          textStyle: {
            textAlign: "center",
            color: "#f8fafc",
          },
          animation: { type: "fade-in", duration: 800, delay: 0 },
          zIndex: 1,
        },
        {
          id: "subtitle-1",
          type: "text",
          bounds: { x: 160, y: 290, width: 640, height: 50 },
          content: "Driving Growth & Sustainable Value",
          semanticStyle: "body",
          textStyle: {
            textAlign: "center",
            color: "#94a3b8",
          },
          animation: { type: "slide-up", duration: 600, delay: 300 },
          zIndex: 1,
        },
        {
          id: "divider-1",
          type: "divider",
          bounds: { x: 380, y: 360, width: 200, height: 2 },
          orientation: "horizontal",
          style: "gradient",
          gradient: {
            type: "linear",
            angle: 90,
            stops: [
              { color: "transparent", position: 0 },
              { color: "#3b82f6", position: 50 },
              { color: "transparent", position: 100 },
            ],
          },
          animation: { type: "fade-in", duration: 500, delay: 600 },
          zIndex: 1,
        },
        {
          id: "date-1",
          type: "text",
          bounds: { x: 60, y: 490, width: 840, height: 30 },
          content: "October 2024",
          semanticStyle: "caption",
          textStyle: {
            textAlign: "center",
            color: "#64748b",
          },
          animation: { type: "fade-in", duration: 500, delay: 800 },
          zIndex: 1,
        },
      ],
    },

    // Slide 2: Key Metrics
    {
      id: "slide-2",
      name: "Key Metrics",
      layoutType: "metrics-grid",
      background: {
        type: "solid",
        color: "#0f172a",
      },
      elements: [
        {
          id: "header-2",
          type: "text",
          bounds: { x: 60, y: 40, width: 400, height: 50 },
          content: "Key Performance Metrics",
          semanticStyle: "h2",
          textStyle: { color: "#f8fafc" },
          animation: { type: "slide-right", duration: 500, delay: 0 },
        },
        // Metric Cards
        {
          id: "metric-1",
          type: "metric",
          bounds: { x: 60, y: 120, width: 260, height: 160 },
          value: "$2.4M",
          label: "Total Revenue",
          change: {
            value: "+12%",
            direction: "up",
            label: "YoY",
          },
          fill: {
            type: "solid",
            color: "#1e293b",
          },
          valueStyle: { fontSize: 42, fontWeight: 700, color: "#3b82f6" },
          animation: { type: "zoom-in", duration: 400, delay: 100 },
        },
        {
          id: "metric-2",
          type: "metric",
          bounds: { x: 350, y: 120, width: 260, height: 160 },
          value: "85%",
          label: "Gross Margin",
          change: {
            value: "+2%",
            direction: "up",
            label: "QoQ",
          },
          fill: {
            type: "solid",
            color: "#1e293b",
          },
          valueStyle: { fontSize: 42, fontWeight: 700, color: "#22c55e" },
          animation: { type: "zoom-in", duration: 400, delay: 200 },
        },
        {
          id: "metric-3",
          type: "metric",
          bounds: { x: 640, y: 120, width: 260, height: 160 },
          value: "1.2K",
          label: "New Customers",
          change: {
            value: "Record",
            direction: "up",
            label: "High",
          },
          fill: {
            type: "solid",
            color: "#1e293b",
          },
          valueStyle: { fontSize: 42, fontWeight: 700, color: "#8b5cf6" },
          animation: { type: "zoom-in", duration: 400, delay: 300 },
        },
        // Progress indicators
        {
          id: "progress-1",
          type: "progress",
          bounds: { x: 60, y: 310, width: 260, height: 100 },
          value: 78,
          variant: "bar",
          label: "Annual Target Progress",
          showValue: true,
          valueFormat: "{value}%",
          colors: {
            track: "#334155",
            fill: "#3b82f6",
            text: "#f8fafc",
          },
          thickness: 12,
          animation: { type: "fade-in", duration: 500, delay: 400 },
        },
        {
          id: "progress-2",
          type: "progress",
          bounds: { x: 350, y: 310, width: 140, height: 140 },
          value: 92,
          variant: "circle",
          label: "Customer Satisfaction",
          showValue: true,
          colors: {
            track: "#334155",
            fill: "#22c55e",
            text: "#f8fafc",
          },
          thickness: 10,
          animation: { type: "fade-in", duration: 500, delay: 500 },
        },
        {
          id: "progress-3",
          type: "progress",
          bounds: { x: 520, y: 310, width: 180, height: 130 },
          value: 65,
          variant: "gauge",
          label: "Market Share",
          showValue: true,
          valueFormat: "{value}%",
          colors: {
            track: "#334155",
            fill: "#f59e0b",
            text: "#f8fafc",
          },
          thickness: 12,
          animation: { type: "fade-in", duration: 500, delay: 600 },
        },
      ],
    },

    // Slide 3: Revenue Chart
    {
      id: "slide-3",
      name: "Revenue Trajectory",
      layoutType: "chart",
      background: {
        type: "solid",
        color: "#0f172a",
      },
      elements: [
        {
          id: "header-3",
          type: "text",
          bounds: { x: 60, y: 40, width: 500, height: 50 },
          content: "Revenue Trajectory",
          semanticStyle: "h2",
          textStyle: { color: "#f8fafc" },
          animation: { type: "slide-right", duration: 500 },
        },
        {
          id: "chart-1",
          type: "chart",
          chartType: "bar",
          bounds: { x: 60, y: 110, width: 520, height: 380 },
          data: {
            labels: ["Q1", "Q2", "Q3", "Q4 (Proj)"],
            datasets: [
              { label: "Revenue", data: [65, 78, 90, 110], color: "#3b82f6" },
              { label: "Expenses", data: [45, 52, 58, 65], color: "#64748b" },
            ],
          },
          options: {
            showLegend: true,
            showGrid: true,
            showLabels: true,
            animate: true,
          },
          animation: { type: "fade-in", duration: 600, delay: 200 },
        },
        // Key insights callout
        {
          id: "callout-1",
          type: "callout",
          bounds: { x: 610, y: 110, width: 290, height: 180 },
          variant: "success",
          content:
            "<strong>Strong Growth</strong><br/><br/>Revenue increased 15% QoQ, driven by enterprise segment expansion and improved customer retention.",
          textStyle: { fontSize: 14, lineHeight: 1.6 },
          animation: { type: "slide-left", duration: 500, delay: 400 },
        },
        // Targets list
        {
          id: "list-1",
          type: "list",
          bounds: { x: 610, y: 310, width: 290, height: 180 },
          listType: "checklist",
          items: [
            { content: "Expand APAC presence", checked: true },
            { content: "Launch enterprise tier", checked: true },
            { content: "Reduce churn below 5%", checked: false },
            { content: "Hit $10M ARR", checked: false },
          ],
          textStyle: { fontSize: 14, color: "#e2e8f0" },
          spacing: 12,
          animation: {
            type: "fade-in",
            duration: 500,
            delay: 600,
            stagger: 100,
          },
        },
      ],
    },

    // Slide 4: Team & Timeline
    {
      id: "slide-4",
      name: "Roadmap",
      layoutType: "content-two-column",
      background: {
        type: "solid",
        color: "#0f172a",
      },
      elements: [
        {
          id: "header-4",
          type: "text",
          bounds: { x: 60, y: 40, width: 500, height: 50 },
          content: "Product Roadmap",
          semanticStyle: "h2",
          textStyle: { color: "#f8fafc" },
          animation: { type: "slide-right", duration: 500 },
        },
        // Table
        {
          id: "table-1",
          type: "table",
          bounds: { x: 60, y: 110, width: 520, height: 380 },
          headers: {
            cells: [
              { content: "Feature", align: "left" },
              { content: "Status", align: "center" },
              { content: "ETA", align: "center" },
            ],
          },
          rows: [
            {
              cells: [
                { content: "AI-Powered Analytics" },
                {
                  content: "✅ Complete",
                  align: "center",
                  textStyle: { color: "#22c55e" },
                },
                { content: "Q3 2024", align: "center" },
              ],
            },
            {
              cells: [
                { content: "Mobile App v2.0" },
                {
                  content: "🚧 In Progress",
                  align: "center",
                  textStyle: { color: "#f59e0b" },
                },
                { content: "Q4 2024", align: "center" },
              ],
            },
            {
              cells: [
                { content: "Enterprise SSO" },
                {
                  content: "📋 Planned",
                  align: "center",
                  textStyle: { color: "#94a3b8" },
                },
                { content: "Q1 2025", align: "center" },
              ],
            },
            {
              cells: [
                { content: "API v3.0" },
                {
                  content: "📋 Planned",
                  align: "center",
                  textStyle: { color: "#94a3b8" },
                },
                { content: "Q1 2025", align: "center" },
              ],
            },
          ],
          style: {
            headerFill: { type: "solid", color: "#334155" },
            alternateRowFill: { type: "solid", color: "#1e293b" },
            showRowBorders: true,
            borderColor: "#334155",
            cellPadding: { top: 12, right: 16, bottom: 12, left: 16 },
          },
          animation: { type: "fade-in", duration: 600, delay: 200 },
        },
        // Quote
        {
          id: "quote-1",
          type: "callout",
          bounds: { x: 610, y: 110, width: 290, height: 160 },
          variant: "quote",
          content:
            "Our focus remains on delivering value to customers while building for scale.",
          author: "Sarah Chen",
          authorTitle: "CEO",
          animation: { type: "fade-in", duration: 500, delay: 400 },
        },
        // Code snippet example
        {
          id: "code-1",
          type: "code",
          bounds: { x: 610, y: 290, width: 290, height: 200 },
          code: `// New API v3.0 Preview
const analytics = await api.v3
  .analytics()
  .query({
    metrics: ['revenue', 'users'],
    period: 'Q3-2024',
    groupBy: 'region'
  });`,
          language: "typescript",
          theme: "dracula",
          showLineNumbers: true,
          fontSize: 11,
          animation: { type: "fade-in", duration: 500, delay: 600 },
        },
      ],
    },

    // Slide 5: Thank You
    {
      id: "slide-5",
      name: "Thank You",
      layoutType: "thank-you",
      background: {
        type: "gradient",
        gradient: {
          type: "linear",
          angle: 135,
          stops: [
            { color: "#1e293b", position: 0 },
            { color: "#0f172a", position: 100 },
          ],
        },
      },
      elements: [
        {
          id: "shape-bg",
          type: "shape",
          variant: "circle",
          bounds: { x: 600, y: 200, width: 500, height: 500 },
          fill: {
            type: "gradient",
            gradient: {
              type: "radial",
              centerX: "50%",
              centerY: "50%",
              radius: "50%",
              stops: [
                { color: "#8b5cf6", position: 0 },
                { color: "transparent", position: 100 },
              ],
            },
          },
          effects: { opacity: 0.2 },
          zIndex: 0,
        },
        {
          id: "thank-you-text",
          type: "text",
          bounds: { x: 60, y: 180, width: 500, height: 80 },
          content: "Thank You",
          semanticStyle: "h1",
          textStyle: { color: "#f8fafc" },
          animation: { type: "fade-in", duration: 800 },
          zIndex: 1,
        },
        {
          id: "contact-text",
          type: "text",
          bounds: { x: 60, y: 280, width: 400, height: 30 },
          content: "Questions? Let's discuss.",
          semanticStyle: "body",
          textStyle: { color: "#94a3b8" },
          animation: { type: "slide-up", duration: 500, delay: 300 },
          zIndex: 1,
        },
        {
          id: "divider-2",
          type: "divider",
          bounds: { x: 60, y: 340, width: 100, height: 2 },
          orientation: "horizontal",
          style: "solid",
          color: "#3b82f6",
          thickness: 2,
          animation: { type: "fade-in", duration: 500, delay: 500 },
          zIndex: 1,
        },
        {
          id: "contact-info",
          type: "list",
          bounds: { x: 60, y: 370, width: 300, height: 120 },
          listType: "icon",
          items: [
            { content: "finance@acme.com", icon: "📧" },
            { content: "acme.com/investor-relations", icon: "🌐" },
            { content: "@AcmeCorp", icon: "𝕏" },
          ],
          textStyle: { fontSize: 14, color: "#94a3b8" },
          spacing: 16,
          animation: { type: "fade-in", duration: 500, delay: 700 },
          zIndex: 1,
        },
      ],
    },
  ],
};

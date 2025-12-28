import { PresentationConfig } from '../types/presentation-schema';

export const MOCK_PRESENTATION: PresentationConfig = {
  title: "Q3 2024 Financial Report",
  themeId: "corporate-day",
  aspectRatio: "16:9",
  slides: [
    {
      id: "slide-1",
      layoutId: "title-center",
      background: "theme.colors.background.default",
      elements: [
        {
          id: "el-1",
          type: "text",
          x: 120,
          y: 180,
          width: 720,
          height: 120,
          content: "<h1 style='text-align: center'>Q3 2024 Financial Results</h1>",
          style: "h1",
          align: "center",
          animation: { type: "fade-in", duration: 800, delay: 0, ease: "ease-out" }
        },
        {
          id: "el-2",
          type: "text",
          x: 230,
          y: 300,
          width: 500,
          height: 60,
          content: "<p style='text-align: center'>Driving Growth & Sustainable Value</p>",
          style: "body",
          align: "center",
          color: "theme.colors.text.secondary",
          animation: { type: "slide-up", duration: 600, delay: 300, ease: "ease-out" }
        }
      ]
    },
    {
      id: "slide-2",
      layoutId: "metrics-overview",
      background: "theme.colors.background.default",
      elements: [
        {
          id: "header-2",
          type: "text",
          x: 60,
          y: 50,
          width: 800,
          height: 80,
          content: "<h2>Key Performance Metrics</h2>",
          style: "h2",
          align: "left"
        },
        // Metric Card 1
        {
          id: "bg-1",
          type: "shape",
          variant: "rect",
          x: 60,
          y: 150,
          width: 260,
          height: 180,
          fill: "theme.colors.background.accent",
          stroke: "theme.colors.ui.border",
          strokeWidth: 1
        },
        {
          id: "m-1",
          type: "text",
          x: 80,
          y: 170,
          width: 220,
          height: 140,
          content: "<h3 style='text-align: center; color: #2563eb'>$2.4M</h3><p style='text-align: center'>Total Revenue<br/><strong style='color: #22c55e'>+12% YoY</strong></p>",
          style: "h3",
          align: "center"
        },
         // Metric Card 2
         {
          id: "bg-2",
          type: "shape",
          variant: "rect",
          x: 350,
          y: 150,
          width: 260,
          height: 180,
          fill: "theme.colors.background.accent",
          stroke: "theme.colors.ui.border",
          strokeWidth: 1
        },
        {
          id: "m-2",
          type: "text",
          x: 370,
          y: 170,
          width: 220,
          height: 140,
          content: "<h3 style='text-align: center; color: #2563eb'>85%</h3><p style='text-align: center'>Gross Margin<br/><strong style='color: #22c55e'>+2% QoQ</strong></p>",
          style: "h3",
          align: "center"
        },
         // Metric Card 3
         {
          id: "bg-3",
          type: "shape",
          variant: "rect",
          x: 640,
          y: 150,
          width: 260,
          height: 180,
          fill: "theme.colors.background.accent",
          stroke: "theme.colors.ui.border",
          strokeWidth: 1
        },
        {
          id: "m-3",
          type: "text",
          x: 660,
          y: 170,
          width: 220,
          height: 140,
          content: "<h3 style='text-align: center; color: #2563eb'>1.2K</h3><p style='text-align: center'>New Customers<br/><strong style='color: #22c55e'>Record High</strong></p>",
          style: "h3",
          align: "center"
        }
      ]
    },
    {
      id: "slide-3",
      layoutId: "chart-view",
      background: "theme.colors.background.default",
      elements: [
        {
            id: "header-3",
            type: "text",
            x: 60,
            y: 50,
            width: 800,
            height: 80,
            content: "<h2>Revenue Trajectory</h2>",
            style: "h2",
            align: "left"
        },
        {
          id: "chart-1",
          type: "chart",
          chartType: "bar",
          x: 60,
          y: 140,
          width: 840,
          height: 340,
          showLegend: true,
          data: {
            labels: ["Q1", "Q2", "Q3", "Q4 (Proj)"],
            datasets: [
              { label: "Revenue", data: [65, 78, 90, 110], color: "theme.colors.brand.primary" }
            ]
          }
        }
      ]
    }
  ]
};
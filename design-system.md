# UI/UX Design System Specification

## 🎨 Color Palette & Semantics

| Token | Hex / Class | Purpose & Meaning |
| :--- | :--- | :--- |
| **Primary Brand** | `#4F46E5` (`indigo-600`) | Main actions, primary CTA buttons, active sidebar links, brand highlights. |
| **Primary Hover** | `#4338CA` (`indigo-700`) | Hover state for primary buttons. |
| **Secondary Brand** | `#0EA5E9` (`sky-500`) | Accents, info badges, secondary highlights. |
| **Background Dark** | `#0F172A` (`slate-900`) | High-contrast dark backgrounds, headers. |
| **Surface Light** | `#F8FAFC` (`slate-50`) | Main app body background. |
| **Card White** | `#FFFFFF` (`white`) | Dashboard cards, question containers, modals. |
| **Border Gray** | `#E2E8F0` (`slate-200`) | Subtle dividers, card borders, input borders. |
| **Text Primary** | `#0F172A` (`slate-900`) | Headings, questions, primary readable text. |
| **Text Muted** | `#64748B` (`slate-500`) | Subtitles, meta-tags, helper notes. |
| **Success** | `#10B981` (`emerald-500`)| High score (>=8), correct answer indicator, success toast. |
| **Warning** | `#F59E0B` (`amber-500`)  | Average score (5-7), missing concepts notice, timer alert. |
| **Danger** | `#EF4444` (`red-500`)    | Low score (<5), errors, destructive actions (delete session). |

### Role Badges
- **Software Developer**: `bg-indigo-50 text-indigo-700 border-indigo-200`
- **Data Analyst**: `bg-emerald-50 text-emerald-700 border-emerald-200`
- **ECE / Core Electronics**: `bg-amber-50 text-amber-700 border-amber-200`

---

## 🔤 Typography & Scale
- **Font Stack**: Modern system sans-serif (`Inter`, system-ui, -apple-system, sans-serif) for crystal clear legibility on low-resolution displays.
- **Heading 1**: `text-3xl font-extrabold tracking-tight` (30px) for page titles.
- **Heading 2**: `text-xl font-bold` (20px) for section headers & card titles.
- **Heading 3**: `text-lg font-semibold` (18px) for question prompts.
- **Body Regular**: `text-base text-slate-700` (16px, line-height 1.6) for paragraph content and AI explanations.
- **Small / Metadata**: `text-xs font-medium text-slate-500` for badges, tags, timestamps.

---

## 📐 Layout System
- **Public Layout**: Fixed modern navbar with Logo, Links (Features, Tracks, How it Works), Login & Register CTAs, followed by main hero & footer.
- **Dashboard Layout**:
  - **Sidebar Navigation (Collapsible on mobile)**: Brand Logo, Role Indicator, Navigation links (Dashboard, Question Bank, Mock Interview, Resume Analyzer, History, Profile).
  - **Top Bar**: Search bar / quick action button, user avatar, logout.
  - **Content Canvas**: Responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3/4`) with fluid gutters (`gap-6`).

---

## 🔘 Component State Design Patterns

### 1. Buttons
- **Primary**: Solid Indigo with subtle shadow (`bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`).
- **Secondary**: Outlined or light slate (`border border-slate-300 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg`).
- **Loading State**: Disabled with animated spinner icon (`animate-spin`) and text (e.g., *"Evaluating answer..."*).
- **Disabled**: Low opacity (`opacity-50 cursor-not-allowed`).

### 2. Form Inputs
- Clear floating or stacked labels.
- Soft slate border with prominent indigo focus ring (`focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none`).
- Inline error messages in red with an alert icon when validation fails.

### 3. Cards & Panels
- White background with soft border and subtle hover elevation (`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6`).

### 4. Empty & Loading States
- Empty state: Clean illustrated placeholder with Lucide icon (e.g., `Inbox` or `FolderOpen`), friendly title *"No sessions attempted yet"*, and a direct CTA *"Start your first mock interview"*.
- Skeleton loaders: Subtle pulsing gray bars (`animate-pulse bg-slate-200 rounded`) while fetching data from API.

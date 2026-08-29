import {
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  Lightbulb,
  Mic2,
  Palette,
} from "lucide-react"

const icons = {
  Technology: Code2,
  Career: BriefcaseBusiness,
  Education: GraduationCap,
  Workshops: Lightbulb,
  Conferences: Mic2,
  Creative: Palette,
}

function CategoryCard({ category }) {
  const Icon = icons[category.name] || Lightbulb

  return (
    <button
      type="button"
      className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-900 transition group-hover:bg-slate-950 group-hover:text-white">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-5 font-semibold text-slate-950">
        {category.name}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {category.name} events
      </p>
    </button>
  )
}

export default CategoryCard
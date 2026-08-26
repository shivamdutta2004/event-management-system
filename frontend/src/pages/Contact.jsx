import {
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react"

import { Link } from "react-router-dom"


function Contact() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">

      {/* Header */}

      <section className="border-b border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50">

        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">

          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Contact Evently
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            We'd love to hear from you.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Have a question about Evently, an event, or the project?
            Get in touch using one of the options below.
          </p>

        </div>

      </section>


      {/* Contact options */}

      <main className="mx-auto max-w-5xl px-6 py-12 lg:px-8">

        <div className="grid gap-6 md:grid-cols-3">


          {/* Email */}

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=shivamdutt04@gmail.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Mail className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-950">
              Email
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              shivamdutt04@gmail.com
            </p>

          </a>


          {/* LinkedIn */}

          <a
            href="https://linkedin.com/in/shivam-dutta-67a39b2b0"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <MessageCircle className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-950">
              LinkedIn
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Connect with Shivam Dutta
            </p>

          </a>


          {/* Location */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <MapPin className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-950">
              Location
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Assam, India
            </p>

          </div>

        </div>


        <div className="mt-10">

          <Link
            to="/"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Evently
          </Link>

        </div>

      </main>

    </div>
  )
}


export default Contact
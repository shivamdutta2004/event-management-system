import {
  Camera,
  CheckCircle2,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  User,
} from "lucide-react"
import { useState } from "react"

function Profile() {
  const [profileImage, setProfileImage] = useState(null)
  const [activeSection, setActiveSection] = useState("profile")

  const [profile, setProfile] = useState({
    name: "Shivam Dutta",
    email: "shivam@example.com",
    role: "Organizer",
    phone: "+91 98765 43210",
    organization: "Evently Community",
    bio: "Event organizer interested in technology, learning and community-driven experiences.",
  })

  const handleProfileChange = (field, value) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    setProfileImage(URL.createObjectURL(file))
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <section className="relative overflow-hidden border-b border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50">

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />

        <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-blue-200/25 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/50">
              <User className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                Account
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Profile settings
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Manage your personal information, account preferences and
                security settings.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">

          {/* =================================================
              SIDEBAR
          ================================================== */}
          <aside className="h-fit rounded-2xl border border-indigo-100 bg-white p-2 shadow-sm">

            <button
              type="button"
              onClick={() => setActiveSection("profile")}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                activeSection === "profile"
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
            >
              <User className="h-4 w-4" />
              Profile
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("security")}
              className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                activeSection === "security"
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
            >
              <LockKeyhole className="h-4 w-4" />
              Security
            </button>

          </aside>

          {/* =================================================
              PROFILE
          ================================================== */}
          {activeSection === "profile" ? (

            <div className="space-y-8">

              {/* Personal information */}
              <section className="overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-sm">

                <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-white to-violet-50/50 px-6 py-5 sm:px-8">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                      <User className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-slate-950">
                        Personal information
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Update the information displayed on your account.
                      </p>
                    </div>

                  </div>

                </div>

                <div className="px-6 py-6 sm:px-8">

                  {/* Profile photo */}
                  <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 to-violet-50/50 p-5">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                      <div className="relative">

                        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-2xl font-bold text-white shadow-lg shadow-indigo-200/40">

                          {profileImage ? (
                            <img
                              src={profileImage}
                              alt="Profile"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            "SD"
                          )}

                        </div>

                        <label
                          htmlFor="profile-image"
                          className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border-2 border-white bg-slate-950 text-white shadow-sm transition hover:bg-indigo-700"
                        >
                          <Camera className="h-4 w-4" />
                        </label>

                        <input
                          id="profile-image"
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={handleImageChange}
                          className="hidden"
                        />

                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-950">
                          Profile photo
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          JPG, PNG or WEBP. Recommended size 400 × 400px.
                        </p>

                        <p className="mt-2 inline-flex rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">
                          Organizer profile
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* Fields */}
                  <div className="mt-8 grid gap-5 md:grid-cols-2">

                    <div>
                      <label
                        htmlFor="profile-name"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Full name
                      </label>

                      <input
                        id="profile-name"
                        type="text"
                        value={profile.name}
                        onChange={(event) =>
                          handleProfileChange(
                            "name",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition hover:border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="profile-email"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Email address
                      </label>

                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-500" />

                        <input
                          id="profile-email"
                          type="email"
                          value={profile.email}
                          onChange={(event) =>
                            handleProfileChange(
                              "email",
                              event.target.value
                            )
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-950 outline-none transition hover:border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="profile-phone"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Phone number
                      </label>

                      <input
                        id="profile-phone"
                        type="tel"
                        value={profile.phone}
                        onChange={(event) =>
                          handleProfileChange(
                            "phone",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition hover:border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="profile-role"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Account role
                      </label>

                      <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />

                        <span className="text-sm font-medium text-slate-700">
                          {profile.role}
                        </span>

                        <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-500" />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="profile-organization"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Organization
                      </label>

                      <input
                        id="profile-organization"
                        type="text"
                        value={profile.organization}
                        onChange={(event) =>
                          handleProfileChange(
                            "organization",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition hover:border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="profile-bio"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Bio
                      </label>

                      <textarea
                        id="profile-bio"
                        rows="5"
                        value={profile.bio}
                        onChange={(event) =>
                          handleProfileChange(
                            "bio",
                            event.target.value
                          )
                        }
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition hover:border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                      />
                    </div>

                  </div>

                  {/* Save */}
                  <div className="mt-7 flex justify-end border-t border-indigo-100 pt-6">

                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200/30 transition hover:from-indigo-700 hover:to-violet-700"
                    >
                      <Save className="h-4 w-4" />
                      Save changes
                    </button>

                  </div>

                </div>
              </section>

              {/* Account overview */}
              <section className="grid gap-4 sm:grid-cols-3">

                <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-indigo-700">
                    Account type
                  </p>

                  <p className="mt-2 text-lg font-bold text-slate-950">
                    Organizer
                  </p>

                  <p className="mt-1 text-xs text-emerald-600">
                    Verified account
                  </p>
                </div>

                <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/70 to-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-violet-700">
                    Events created
                  </p>

                  <p className="mt-2 text-lg font-bold text-slate-950">
                    12
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Since joining
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-blue-700">
                    Member since
                  </p>

                  <p className="mt-2 text-lg font-bold text-slate-950">
                    Jan 2026
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Evently member
                  </p>
                </div>

              </section>

            </div>

          ) : (

            /* =================================================
               SECURITY
            ================================================== */
            <div className="space-y-8">

              <section className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">

                <div className="border-b border-rose-100 bg-gradient-to-r from-rose-50/70 via-white to-violet-50/40 px-6 py-5 sm:px-8">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                      <LockKeyhole className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-slate-950">
                        Security
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Protect your account and manage your password.
                      </p>
                    </div>

                  </div>

                </div>

                <div className="space-y-6 px-6 py-6 sm:px-8">

                  <div>
                    <label
                      htmlFor="current-password"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Current password
                    </label>

                    <input
                      id="current-password"
                      type="password"
                      placeholder="Enter your current password"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition hover:border-rose-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-100/50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="new-password"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      New password
                    </label>

                    <input
                      id="new-password"
                      type="password"
                      placeholder="Create a new password"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition hover:border-rose-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-100/50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-new-password"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Confirm new password
                    </label>

                    <input
                      id="confirm-new-password"
                      type="password"
                      placeholder="Re-enter the new password"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition hover:border-rose-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-100/50"
                    />
                  </div>

                  <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-800">
                    Use a strong password with uppercase letters, lowercase
                    letters, numbers and special characters.
                  </div>

                  <div className="flex justify-end border-t border-rose-100 pt-6">

                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200/30 transition hover:from-rose-700 hover:to-violet-700"
                    >
                      <LockKeyhole className="h-4 w-4" />
                      Update password
                    </button>

                  </div>

                </div>
              </section>

            </div>
          )}

        </div>
      </main>
    </div>
  )
}

export default Profile
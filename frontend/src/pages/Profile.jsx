import {
  Camera,
  CheckCircle2,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  User,
} from "lucide-react"

import { useEffect, useState } from "react"

import { useNavigate } from "react-router-dom"

import { apiRequest } from "../lib/api"


const API_BASE_URL =
  "http://127.0.0.1:8000"


function Profile() {
  const navigate = useNavigate()

  // =========================================================
  // STATE
  // =========================================================

  const [profileImage, setProfileImage] =
    useState(null)

  const [activeSection, setActiveSection] =
    useState("profile")

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    organization: "",
    bio: "",
  })

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [uploadingImage, setUploadingImage] =
    useState(false)

  const [message, setMessage] =
    useState("")

  const [error, setError] =
    useState("")

  const [eventsCreated, setEventsCreated] =
    useState(0)

  // =========================================================
  // PASSWORD CHANGE STATE
  // =========================================================

  const [currentPassword, setCurrentPassword] =
    useState("")

  const [newPassword, setNewPassword] =
    useState("")

  const [confirmNewPassword, setConfirmNewPassword] =
    useState("")

  const [changingPassword, setChangingPassword] =
    useState(false)

  const [passwordMessage, setPasswordMessage] =
    useState("")

  const [passwordError, setPasswordError] =
    useState("")


  // =========================================================
  // CONVERT BACKEND IMAGE PATH TO FULL URL
  // =========================================================

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return null
    }

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://") ||
      imagePath.startsWith("blob:")
    ) {
      return imagePath
    }

    return `${API_BASE_URL}${imagePath}`
  }


  // =========================================================
  // LOAD PROFILE
  // =========================================================

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      setError("")

      try {
        const [
          userData,
          eventsData,
        ] = await Promise.all([
          apiRequest("/api/auth/me"),
          apiRequest("/api/events"),
        ])


        // -----------------------------------------------------
        // USER PROFILE
        // -----------------------------------------------------

        setProfile({
          name:
            userData.full_name || "",

          email:
            userData.email || "",

          role:
            userData.role || "",

          phone:
            userData.phone || "",

          organization:
            userData.organization || "",

          bio:
            userData.bio || "",
        })


        // -----------------------------------------------------
        // PROFILE IMAGE
        // -----------------------------------------------------

        setProfileImage(
          getImageUrl(
            userData.profile_image
          )
        )


        // -----------------------------------------------------
        // REAL EVENTS CREATED
        // -----------------------------------------------------

        const allEvents =
          Array.isArray(eventsData)
            ? eventsData
            : eventsData?.events || []


        const organizerEvents =
          allEvents.filter(
            (event) =>
              Number(
                event.organizer_id
              ) === Number(
                userData.id
              )
          )


        setEventsCreated(
          organizerEvents.length
        )

      } catch (err) {
        console.error(
          "Failed to load profile:",
          err
        )

        const message =
          err?.message ||
          "Unable to load your profile."

        const authFailed =
          message
            .toLowerCase()
            .includes("not authenticated") ||
          message
            .toLowerCase()
            .includes("unauthorized") ||
          message.includes("401")

        if (authFailed) {
          navigate("/login", { replace: true })
          return
        }

        setError(message)

      } finally {
        setLoading(false)
      }
    }


    loadProfile()
  }, [])


  // =========================================================
  // PROFILE FIELD CHANGE
  // =========================================================

  const handleProfileChange = (
    field,
    value
  ) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }))

    setMessage("")
    setError("")
  }


  // =========================================================
  // PROFILE IMAGE UPLOAD
  // =========================================================

  const handleImageChange = async (
    event
  ) => {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }


    // -------------------------------------------------------
    // VALIDATE TYPE
    // -------------------------------------------------------

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ]


    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setError(
        "Please upload a PNG, JPG or WEBP image."
      )

      event.target.value = ""
      return
    }


    // -------------------------------------------------------
    // VALIDATE SIZE
    // -------------------------------------------------------

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Image size must be 5 MB or less."
      )

      event.target.value = ""
      return
    }


    setError("")
    setMessage("")
    setUploadingImage(true)


    // -------------------------------------------------------
    // SHOW LOCAL PREVIEW IMMEDIATELY
    // -------------------------------------------------------

    const localPreview =
      URL.createObjectURL(file)

    setProfileImage(
      localPreview
    )


    try {
      // -----------------------------------------------------
      // CREATE FORM DATA
      // -----------------------------------------------------

      const formData =
        new FormData()

      formData.append(
        "file",
        file
      )


      // -----------------------------------------------------
      // UPLOAD TO FASTAPI
      // -----------------------------------------------------

      const updatedUser =
        await apiRequest(
          "/api/auth/me/profile-image",
          {
            method: "POST",
            body: formData,
          }
        )


      // -----------------------------------------------------
      // USE PERMANENT BACKEND URL
      // -----------------------------------------------------

      const permanentImageUrl =
        getImageUrl(
          updatedUser.profile_image
        )


      setProfileImage(
        permanentImageUrl
      )


      setMessage(
        "Profile photo updated successfully."
      )

    } catch (err) {
      console.error(
        "Profile image upload failed:",
        err
      )


      // Restore to no image if upload failed
      setProfileImage(null)


      const message =
        err?.message ||
        "Unable to upload profile photo."


      if (
        message
          .toLowerCase()
          .includes("not authenticated") ||
        message
          .toLowerCase()
          .includes("unauthorized") ||
        message.includes("401")
      ) {
        setError(
          "Your session has expired. Please log in again."
        )
      } else {
        setError(message)
      }

    } finally {
      setUploadingImage(false)

      event.target.value = ""
    }
  }


  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSaveProfile = async () => {
    setMessage("")
    setError("")


    if (!profile.name.trim()) {
      setError(
        "Full name is required."
      )

      return
    }


    if (
      profile.name.trim().length < 2
    ) {
      setError(
        "Full name must contain at least 2 characters."
      )

      return
    }


    setSaving(true)


    try {
      const updatedUser =
        await apiRequest(
          "/api/auth/me",
          {
            method: "PATCH",

            body: {
              full_name:
                profile.name.trim(),

              phone:
                profile.phone.trim()
                  ? profile.phone.trim()
                  : null,

              organization:
                profile.organization.trim()
                  ? profile.organization.trim()
                  : null,

              bio:
                profile.bio.trim()
                  ? profile.bio.trim()
                  : null,
            },
          }
        )


      // -----------------------------------------------------
      // UPDATE UI
      // -----------------------------------------------------

      setProfile({
        name:
          updatedUser.full_name || "",

        email:
          updatedUser.email || "",

        role:
          updatedUser.role || "",

        phone:
          updatedUser.phone || "",

        organization:
          updatedUser.organization || "",

        bio:
          updatedUser.bio || "",
      })


      // Keep backend image if available
      if (
        updatedUser.profile_image
      ) {
        setProfileImage(
          getImageUrl(
            updatedUser.profile_image
          )
        )
      }


      setMessage(
        "Profile updated successfully."
      )

    } catch (err) {
      console.error(
        "Profile update failed:",
        err
      )


      const message =
        err?.message ||
        "Unable to update your profile."


      if (
        message
          .toLowerCase()
          .includes(
            "not authenticated"
          ) ||
        message
          .toLowerCase()
          .includes(
            "unauthorized"
          ) ||
        message.includes("401")
      ) {
        setError(
          "Your session has expired. Please log in again."
        )
      } else {
        setError(message)
      }

    } finally {
      setSaving(false)
    }
  }


  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  const handleChangePassword = async () => {
    setPasswordMessage("")
    setPasswordError("")

    if (!currentPassword) {
      setPasswordError(
        "Current password is required."
      )
      return
    }

    if (!newPassword) {
      setPasswordError(
        "New password is required."
      )
      return
    }

    if (newPassword.length < 8) {
      setPasswordError(
        "New password must be at least 8 characters."
      )
      return
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError(
        "New password and confirmation do not match."
      )
      return
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        "New password must be different from your current password."
      )
      return
    }

    setChangingPassword(true)

    try {
      const response = await apiRequest(
        "/api/auth/change-password",
        {
          method: "POST",
          body: {
            current_password: currentPassword,
            new_password: newPassword,
          },
        }
      )

      setCurrentPassword("")
      setNewPassword("")
      setConfirmNewPassword("")

      setPasswordMessage(
        response?.message ||
        "Password updated successfully."
      )
    } catch (err) {
      console.error(
        "Password change failed:",
        err
      )

      setPasswordError(
        err?.message ||
        "Unable to update your password."
      )
    } finally {
      setChangingPassword(false)
    }
  }


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">

        <section className="border-b border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50">

          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

            <div className="h-5 w-28 animate-pulse rounded bg-indigo-100" />

            <div className="mt-4 h-12 w-72 animate-pulse rounded bg-slate-100" />

            <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-slate-100" />

          </div>

        </section>


        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">

            <div className="h-40 animate-pulse rounded-2xl bg-white" />

            <div className="h-[600px] animate-pulse rounded-2xl bg-white" />

          </div>

        </main>

      </div>
    )
  }


  // =========================================================
  // PAGE
  // =========================================================

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
                Manage your personal information, account preferences and security settings.
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
              onClick={() =>
                setActiveSection("profile")
              }
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
              onClick={() =>
                setActiveSection("security")
              }
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


              {/* =================================================
                  ALERTS
              ================================================== */}

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">

                  <p className="text-sm font-semibold text-red-700">
                    Unable to update profile
                  </p>


                  <p className="mt-1 text-sm text-red-600">
                    {error}
                  </p>

                </div>
              )}


              {message && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">

                  <div className="flex items-center gap-2">

                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />


                    <p className="text-sm font-semibold text-emerald-700">
                      {message}
                    </p>

                  </div>

                </div>
              )}


              {/* =================================================
                  PERSONAL INFORMATION
              ================================================== */}

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


                  {/* =================================================
                      PROFILE PHOTO
                  ================================================== */}

                  <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 to-violet-50/50 p-5">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                      <div className="relative">

                        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-2xl font-bold text-white shadow-lg shadow-indigo-200/40">

                          {profileImage ? (
                            <img
                              src={
                                profileImage
                              }
                              alt="Profile"
                              className="h-full w-full object-cover"
                              onError={() => {
                                setProfileImage(
                                  null
                                )
                              }}
                            />
                          ) : (
                            profile.name
                              ? profile.name
                                  .split(
                                    " "
                                  )
                                  .map(
                                    (
                                      part
                                    ) =>
                                      part[0]
                                  )
                                  .join(
                                    ""
                                  )
                                  .slice(
                                    0,
                                    2
                                  )
                                  .toUpperCase()
                              : "SD"
                          )}

                        </div>


                        <label
                          htmlFor="profile-image"
                          className={`absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border-2 border-white bg-slate-950 text-white shadow-sm transition ${
                            uploadingImage
                              ? "cursor-not-allowed opacity-60"
                              : "cursor-pointer hover:bg-indigo-700"
                          }`}
                        >

                          {uploadingImage ? (

                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                          ) : (

                            <Camera className="h-4 w-4" />

                          )}

                        </label>


                        <input
                          id="profile-image"
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={
                            handleImageChange
                          }
                          disabled={
                            uploadingImage
                          }
                          className="hidden"
                        />

                      </div>


                      <div>

                        <h3 className="font-semibold text-slate-950">
                          Profile photo
                        </h3>


                        <p className="mt-1 text-sm text-slate-500">
                          JPG, PNG or WEBP. Maximum 5 MB.
                        </p>


                        <p className="mt-2 inline-flex rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">
                          {uploadingImage
                            ? "Uploading..."
                            : "Organizer profile"}
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* =================================================
                      FIELDS
                  ================================================== */}

                  <div className="mt-8 grid gap-5 md:grid-cols-2">


                    {/* Full name */}

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
                        value={
                          profile.name
                        }
                        onChange={(event) =>
                          handleProfileChange(
                            "name",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition hover:border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                      />

                    </div>


                    {/* Email */}

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
                          value={
                            profile.email
                          }
                          readOnly
                          className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-600 outline-none"
                        />

                      </div>


                      <p className="mt-1 text-xs text-slate-400">
                        Email changes are not enabled here.
                      </p>

                    </div>


                    {/* Phone */}

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
                        value={
                          profile.phone
                        }
                        onChange={(event) =>
                          handleProfileChange(
                            "phone",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition hover:border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                      />

                    </div>


                    {/* Role */}

                    <div>

                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Account role
                      </label>


                      <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">

                        <ShieldCheck className="h-4 w-4 text-emerald-600" />


                        <span className="text-sm font-medium capitalize text-slate-700">
                          {
                            profile.role
                          }
                        </span>


                        <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-500" />

                      </div>

                    </div>


                    {/* Organization */}

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
                        value={
                          profile.organization
                        }
                        onChange={(event) =>
                          handleProfileChange(
                            "organization",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition hover:border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50"
                      />

                    </div>


                    {/* Bio */}

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
                        value={
                          profile.bio
                        }
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


                  {/* =================================================
                      SAVE
                  ================================================== */}

                  <div className="mt-7 flex justify-end border-t border-indigo-100 pt-6">

                    <button
                      type="button"
                      onClick={
                        handleSaveProfile
                      }
                      disabled={
                        saving ||
                        uploadingImage
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200/30 transition hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      {saving ? (

                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                      ) : (

                        <Save className="h-4 w-4" />

                      )}


                      {saving
                        ? "Saving..."
                        : "Save changes"}

                    </button>

                  </div>

                </div>

              </section>


              {/* =================================================
                  ACCOUNT OVERVIEW
              ================================================== */}

              <section className="grid gap-4 sm:grid-cols-3">


                {/* Account type */}

                <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-white p-5 shadow-sm">

                  <p className="text-sm font-medium text-indigo-700">
                    Account type
                  </p>


                  <p className="mt-2 text-lg font-bold capitalize text-slate-950">
                    {profile.role ||
                      "Organizer"}
                  </p>


                  <p className="mt-1 text-xs text-emerald-600">
                    Active account
                  </p>

                </div>


                {/* Events */}

                <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/70 to-white p-5 shadow-sm">

                  <p className="text-sm font-medium text-violet-700">
                    Events created
                  </p>


                  <p className="mt-2 text-lg font-bold text-slate-950">
                    {eventsCreated}
                  </p>


                  <p className="mt-1 text-xs text-slate-500">
                    Your organizer events
                  </p>

                </div>


                {/* Account */}

                <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-white p-5 shadow-sm">

                  <p className="text-sm font-medium text-blue-700">
                    Account
                  </p>


                  <p className="mt-2 text-lg font-bold text-slate-950">
                    Active
                  </p>


                  <p className="mt-1 text-xs text-slate-500">
                    Evently organizer account
                  </p>

                </div>

              </section>

            </div>

          ) : (

            /* =================================================
               SECURITY
            ================================================== */

            <div className="space-y-8">

              {passwordError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                  <p className="text-sm font-semibold text-red-700">
                    Unable to update password
                  </p>
                  <p className="mt-1 text-sm text-red-600">
                    {passwordError}
                  </p>
                </div>
              )}

              {passwordMessage && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <p className="text-sm font-semibold text-emerald-700">
                      {passwordMessage}
                    </p>
                  </div>
                </div>
              )}

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
                      value={currentPassword}
                      onChange={(event) => {
                        setCurrentPassword(event.target.value)
                        setPasswordMessage("")
                        setPasswordError("")
                      }}
                      placeholder="Enter your current password"
                      autoComplete="current-password"
                      disabled={changingPassword}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition hover:border-rose-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-100/50 disabled:cursor-not-allowed disabled:bg-slate-50"
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
                      value={newPassword}
                      onChange={(event) => {
                        setNewPassword(event.target.value)
                        setPasswordMessage("")
                        setPasswordError("")
                      }}
                      placeholder="Create a new password"
                      autoComplete="new-password"
                      disabled={changingPassword}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition hover:border-rose-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-100/50 disabled:cursor-not-allowed disabled:bg-slate-50"
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
                      value={confirmNewPassword}
                      onChange={(event) => {
                        setConfirmNewPassword(event.target.value)
                        setPasswordMessage("")
                        setPasswordError("")
                      }}
                      placeholder="Re-enter the new password"
                      autoComplete="new-password"
                      disabled={changingPassword}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition hover:border-rose-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-100/50 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />
                  </div>

                  <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-800">
                    Use a password with at least 8 characters.
                  </div>

                  <div className="flex justify-end border-t border-rose-100 pt-6">
                    <button
                      type="button"
                      onClick={handleChangePassword}
                      disabled={changingPassword}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200/30 transition hover:from-rose-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      {changingPassword ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <LockKeyhole className="h-4 w-4" />
                      )}

                      {changingPassword
                        ? "Updating..."
                        : "Update password"}

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
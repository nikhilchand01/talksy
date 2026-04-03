import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthUser from '../hooks/useAuthUser.js';
import { completeOnboarding } from '../lib/api.js';
import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from 'lucide-react';
import { useState } from 'react';
import { CITIES } from '../constants/index.js';
import toast from 'react-hot-toast';

const OnBoardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    age: authUser?.age || "",   // ✅ added age instead of learningLanguage
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const [file, setFile] = useState(null);

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile Completed");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullName", formState.fullName);
    formData.append("bio", formState.bio);
    formData.append("nativeLanguage", formState.nativeLanguage);
    formData.append("age", formState.age);   // ✅ send age instead of learningLanguage
    formData.append("location", formState.location);

    // If file selected, append it, else append profilePic URL
    if (file) {
      formData.append("profilePic", file);
    } else if (formState.profilePic) {
      formData.append("profilePic", formState.profilePic);
    }

    onboardingMutation(formData);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({ ...formState, profilePic: randomAvatar });
    setFile(null); // clear file if random avatar chosen
    toast.success("New Avatar Generated");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFormState({ ...formState, profilePic: URL.createObjectURL(selectedFile) });
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Pic */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* image preview */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img src={formState.profilePic} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              {/* Upload file */}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full max-w-xs"
              />

              {/* Generate random avatar */}
              <button type="button" onClick={handleRandomAvatar} className="btn btn-accent">
                <ShuffleIcon className="size-4 mr-2" />
                Generate Random Avatar
              </button>
            </div>

            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Your Full Name"
              />
            </div>

            {/* Bio */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <input
                type="text"
                name="bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Tell others about yourself"
              />
            </div>

            {/* Languages + Age + Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Native */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select Your Native Language</option>
                  {CITIES.map((city) => (
                    <option key={`native-${city}`} value={city.toLowerCase()}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Age */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Age</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formState.age}
                  onChange={(e) =>
                    setFormState({ ...formState, age: e.target.value })
                  }
                  className="input input-bordered w-full"
                  min="1"
                  max="120"
                />
              </div>

              {/* Location */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                  <input
                    type="text"
                    name="location"
                    value={formState.location}
                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                    className="input input-bordered w-full pl-10"
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </div>

            <button className="btn btn-primary w-full" disabled={isPending} type="submit">
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Profile
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Completing...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnBoardingPage;
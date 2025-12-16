import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronDown, X } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
const Card = ({ className, children }) => (
  <div
    className={`rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-50 shadow-sm ${className}`}
  >
    {children}
  </div>
);

function EditProfile() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [file,setFile] = useState(null)
  const [bio, setBio] = useState(
    "ktdftkdtufudfgd gdfq dfh sdh sdhtsdhs ghdndntrhrsdfnsdf nsdfbdsfb fb dfbsdf b sdfb dsfb dsfb h r tnrsnsrtn fn  fgn fgn fgsnng"
  );
  const maxLength = 150;
  const [selectedGender, setSelectedGender] = useState("Not Selected");
  const [isGenderModalOpen, setIsGenderModalOpen] = useState(false);

  const genderOptions = [
    { id: "Female", label: "Female" },
    { id: "Male", label: "Male" },
    { id: "Custom", label: "Custom" },
    { id: "Prefer not to say", label: "Prefer not to say" },
  ];

  return (
    <>
      <div className="w-full box-border overflow-y-auto max-h-screen ">
        <div className="flex flex-col justify-center px-16">
          <div className=" pt-8 pb-6">
            <h3 className="font-bold text-xl tracking-tight">Edit profile</h3>
          </div>

          <div className="flex flex-col gap-6">
            {/* profile photo */}
            <div className="flex bg-neutral-800 rounded-3xl justify-between p-4">
              <div className="flex flex-row items-center gap-3">
                <div className="size-15 cursor-pointer">
                  <img
                    className="object-cover size-full rounded-full"
                    src="https://plus.unsplash.com/premium_photo-1764501819921-20ae8b7296ad?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                  />
                </div>
                <div>
                  <h4 className="font-bold dark:text-white text-base leading-5">
                    dmitriishirnin
                  </h4>
                  <p className="text-sm text-neutral-300">Dmitrii Shirnin</p>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  id="profile-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {setFile(e.target.files)
                    console.log(file);
                    
                  }}
                  className="hidden"
                />
                <Button
                  variant="main"
                  size={"sm"}
                  className={"font-bold active:scale-98 cursor-pointer"}
                  onClick={() => setDialogOpen(true)}
                >
                  Change Photo
                </Button>
              </div>
            </div>

            {/* Website */}
            <div className="flex flex-col justify-center items-center ">
              <div className="w-full ">
                {/* Label */}
                <Label
                  htmlFor="website"
                  className="text-white font-bold text-md mb-2"
                >
                  Website
                </Label>

                {/* Input Container */}
                <div className="">
                  <input
                    placeholder="Website"
                    id="website"
                    className="w-full flex justify-between items-center px-4 py-3 border border-neutral-700 focus:outline-none  focus:border-white rounded-xl text-left"
                  ></input>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="flex flex-col justify-center items-center ">
              <div className="w-full ">
                {/* Label */}
                <Label
                  htmlFor="bio"
                  className="text-white font-bold text-md mb-2"
                >
                  Bio
                </Label>

                {/* Input Container */}
                <div className="relative">
                  <textarea
                    id="bio"
                    placeholder="Bio"
                    className="
              w-full 
              bg-transparent 
              text-white 
              text-base 
              border  
              border-neutral-700 
              rounded-xl 
              p-3
              focus:outline-none 
              focus:border-white 
              resize-none 
              leading-relaxed
            "
                    // value={bio}
                    // onChange={(e) => setBio(e.target.value)}
                    maxLength={100}
                    spellCheck="false" // set to "true" if you want the red squiggly lines back
                  />

                  {/* Character Counter */}
                  <div className="absolute bottom-4 right-4 text-neutral-400 text-xs font-medium">
                    {/* {bio.length} / {maxLength} */}
                    150/200
                  </div>
                </div>
              </div>
            </div>

            {/* Gender */}
            <div className="flex flex-col justify-center items-center">
              {/* 2. THE GENDER SECTION (Context) */}
              <div className="w-full relative">
                <Label className="text-base font-bold text-white mb-2">
                  Gender
                </Label>

                {/* Trigger Button (Simulated Input) */}
                <button
                  onClick={() => setIsGenderModalOpen(!isGenderModalOpen)}
                  className="cursor-pointer  w-full flex justify-between items-center px-4 py-3 border border-neutral-700 rounded-xl text-left hover:bg-neutral-800 transition-colors"
                >
                  <span>{selectedGender}</span>
                  <ChevronDown size={16} className="text-neutral-500" />
                </button>

                {/* GENDER SELECTION MODAL 
            (Positioned absolutely to simulate the popover in your screenshot)
        */}
                {isGenderModalOpen && (
                  <div className="absolute top-0 left-0  z-10 animate-in fade-in zoom-in-95 duration-200">
                    <Card className="bg-[#262626] border-none shadow-2xl overflow-hidden">
                      {/* Header inside modal (optional, based on standard patterns) */}
                      <div className="p-4 border-b border-neutral-700/50 hidden">
                        <h3 className="font-semibold text-center">Gender</h3>
                      </div>

                      <div className="p-2 space-y-1">
                        {genderOptions.map((option) => {
                          const isSelected = selectedGender === option.id;

                          return (
                            <div key={option.id}>
                              <button
                                onClick={() => setSelectedGender(option.id)}
                                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-neutral-700/50 transition-colors group"
                              >
                                <span className="text-base font-normal">
                                  {option.label}
                                </span>

                                {/* Radio Indicator Logic */}
                                <div
                                  className={`
                          w-6 h-6 rounded-full border flex items-center justify-center transition-all
                          ${
                            isSelected
                              ? "bg-white border-white"
                              : "border-neutral-500 bg-transparent group-hover:border-neutral-400"
                          }
                        `}
                                >
                                  {isSelected && (
                                    <Check
                                      size={16}
                                      className="text-black stroke-[3px]"
                                    />
                                  )}
                                </div>
                              </button>

                              {/* The "Custom" Input Field - Only shows if Custom is clicked (or always there as per your image having a dark box) */}
                              {option.id === "Custom" && (
                                <div
                                  onClick={() => setSelectedGender(option.id)}
                                  className="px-3 pb-2 pt-0"
                                >
                                  <input
                                    type="text"
                                    placeholder="Custom gender"
                                    className="w-full bg-[#1c1c1c] border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neutral-500 placeholder:text-neutral-600"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Close Handle (Optional for demo) */}
                      <div
                        className="w-full py-3 text-center border-t border-neutral-700/50 text-neutral-400 cursor-pointer hover:text-white text-sm"
                        onClick={() => setIsGenderModalOpen(false)}
                      >
                        Done
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </div>

            {/* submit */}
            <div className="flex justify-end  items-center">
              <button className="bg-sky-900 text-sm w-50 h-10 font-bold rounded-xl hover:bg-sky-800 cursor-pointer active:scale-98">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        modal={true}
        open={dialogOpen}

        // onOpenChange={() => setDialogOpen(false)}
      >
        <DialogContent className="sm:max-w-md dark:bg-neutral-900 rounded-3xl">
          <DialogHeader>
            <DialogTitle className={"text-center"}>
              Change Profile Photo
            </DialogTitle>
            <DialogDescription className={"text-center"}></DialogDescription>
          </DialogHeader>
          <Separator className={"w-max z-50"} />
          <label
            htmlFor="profile-photo"
            className="cursor-pointer"
            // onDragOver={handleDragOver}
            // onDragLeave={handleDragLeave}
            // onDrop={handleDrop}
          >
            <p
              className="w-full text-sky-500 font-semibold text-sm text-center"
              type="button"
              variant="secondary"
              >
              Upload Photo
            </p>
              </label>
          <Separator className={"w-max z-50"} />
          <button
            className="w-full text-red-500 font-semibold text-sm cursor-pointer"
            type="button"
            variant="secondary"
            >
            Remove Current Photo
          </button>
          <Separator className={"w-max z-50"} />
          <DialogFooter className={"flex  !justify-center items-center"}>
            <DialogClose asChild>
              <button
                className="w-full dark:text-white text-sm cursor-pointer"
                onClick={() => {
                  setDialogOpen(false);
                }}
                type="button"
                variant="secondary"
              >
                Cancel
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default EditProfile;

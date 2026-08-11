import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";

const Header = () => {
  const [showSignin, setShowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();
  const { user } = useUser();

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  function handleClickOverOnScreen(e) {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  }

  return (
    <div>
      <nav className="flex justify-between items-center pt-2 ">
        <Link>
          <img
            src="/Joblogo.png"
            alt="joblogo"
            className="h-20 max-[325px]:h-15"
          />
        </Link>

        <div className="flex items-center sm:gap-9 gap-4">
          <SignedOut>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowSignIn(true)}
            >
              Login
            </Button>
          </SignedOut>

          <SignedIn>
            {user?.unsafeMetadata?.role === "Recruiter" && (
              <>
              {/* Desktop */}
                <Link to="/post-jobs" className="hidden sm:block">
                  <Button
                    variant="destructive"
                    className=" text-xl px-2 py-4"
                    size="lg"
                  >
                    <PenBox size={20} className="mr-2" />
                    Post a Jobs
                  </Button>
                </Link>
                {/* Mobile screen size */}
                <Link to="/post-jobs" className="block sm:hidden">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-10 w-10"
                  >
                    <PenBox size={20} />
                  </Button>
                </Link>
              </>
            )}
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "!w-12 !h-12",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Jobs"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/myjobs"
                ></UserButton.Link>
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart size={15} />}
                  href="/saved-job"
                ></UserButton.Link>
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>
      {showSignin && (
        <div
          className="flex justify-center items-center bg-black/50 z-50 fixed inset-0"
          onClick={handleClickOverOnScreen}
        >
          <SignIn
            signUpFallbackRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      )}
    </div>
  );
};

export default Header;

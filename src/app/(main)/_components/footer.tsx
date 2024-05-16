import { CodeIcon } from "@radix-ui/react-icons";
import { ThemeToggle } from "@/components/theme-toggle";

const twitterUrl = "https://twitter.com/EvanDevvv";
const privacyPolicyUrl = "/privacy-policy";
const termsOfServiceUrl = "/terms-of-service";
const robloxGroupUrl = "https://www.roblox.com/groups/16838109";

export const Footer = () => {
  return (
    <footer className="mt-6 px-4 py-6">
      <div className="container flex items-center p-0">
        <CodeIcon className="mr-2 h-6 w-6" />
        <p className="text-sm">
          Built by{" "}
          <a className="underline underline-offset-4" href={twitterUrl}>
            EvanDevvv
          </a>
          {" - "}
          <a>SaasyKits</a>
        </p>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
        <div className="ml-4 text-sm">
          <a className="mr-4" href={privacyPolicyUrl}>
            Privacy Policy
          </a>
          <a className="mr-4" href={termsOfServiceUrl}>
            Terms of Service
          </a>
          <a href={robloxGroupUrl}>Our Roblox Group</a>
        </div>
      </div>
    </footer>
  );
};

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Player } from "@/components/player";
import { AdminPanel } from "@/components/admin-panel";
import { Onboarding } from "@/components/onboarding";
import { UserNav } from "@/components/usernav";

import {
  isAdmin,
  isLogged,
  logout,
  name,
  isOnboarded,
} from "@/services/UsersService";

export function Dashboard() {
  React.useEffect(() => {
    if (!isLogged()) {
      window.location.href = "/";
      return;
    }
  }, []);

  return (
    <>
      <div className="absolute top-2 left-2 z-30">
        <Button
          variant="outline"
          onClick={logout}
          className="px-1 h-[35px] border-2 border-secondary"
        >
          <img src="/close.png" width={"20"} />
        </Button>
      </div>
      <div className="flex-1 space-y-2 p-8 pt-0 container mx-auto">
        <div>
          {isAdmin() ? (
            <AdminPanel />
          ) : isOnboarded() ? (
            <Player />
          ) : (
            <Onboarding />
          )}
        </div>
      </div>
    </>
  );
}

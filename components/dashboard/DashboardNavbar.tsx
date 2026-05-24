"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";

export default function DashboardNavbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <nav style={{
      background: "rgba(255,255,255,0.02)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      padding: "0 24px",
      height: "56px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 10,
      backdropFilter: "blur(12px)",
    }}>

      {/* Logo */}
      <span style={{
        color: "#fff",
        fontWeight: "700",
        fontSize: "16px",
        letterSpacing: "-0.02em",
      }}>
        SpendAI
      </span>

      {/* Right side — avatar, name, sign out */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="avatar"
            style={{ width: "28px", height: "28px", borderRadius: "50%" }}
          />
        ) : (
          <div style={{
            width: "28px", height: "28px", borderRadius: "50%",
            background: "#6366f1", display: "flex",
            alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: "12px", fontWeight: "600",
          }}>
            {user?.displayName?.[0] ?? "U"}
          </div>
        )}

        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
          {user?.displayName?.split(" ")[0]}
        </span>

        <button
          onClick={handleSignOut}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.35)",
            borderRadius: "8px",
            padding: "5px 13px",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
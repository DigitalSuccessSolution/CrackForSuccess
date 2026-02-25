import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

/**
 * Custom hook to manage free question limits per department.
 * @param {string} storageScope - Unique key for localStorage (e.g., 'Mechanical', 'job_CSE'). Will be lowercased for storage.
 * @param {string|boolean} authScope - Key to check in user.sections OR explicit boolean value.
 * @param {number} limit - Number of free questions allowed (default 3).
 */
const useFreeLimit = (storageScope, authScope, limit = 3) => {
  const { user } = useContext(AuthContext);

  // Map input scope to backend usage keys
  let backendKey = "cse_maang"; // default

  const scope = storageScope ? storageScope.toLowerCase() : "";

  if (scope.includes("job_")) {
    if (scope.includes("mechanical")) backendKey = "me";
    else if (scope.includes("ece")) backendKey = "ece";
    else if (scope.includes("ee")) backendKey = "ee_job";
    else if (scope.includes("cse")) backendKey = "cse_job";
  } else {
    // Check if the scope itself is a department (like 'Mechanical' or 'ECE')
    // This handles DynamicSection usage
    if (scope.includes("mechanical") || scope === "me") backendKey = "me";
    else if (scope.includes("ece")) backendKey = "ece";
    else if (scope === "ee") backendKey = "ee_job";
    // Assumption: Default 'cse' or similar maps to MAANG/Question model
    else if (scope === "cse") backendKey = "cse_maang";
    // Add other mappings if needed
  }

  // Get Usage Data from User Object (Secure Source)
  const usageList = user?.usage?.[backendKey] || [];

  // Determine premium status
  // User object should have isPremiumUser global flag, or we check section specific.
  // The user prompt says "Premium users should have unlimited access".
  const isPremium = user?.isPremiumUser || user?.role === "admin";

  /**
   * Check if a question is accessible.
   */
  const canAccess = (questionId) => {
    if (isPremium) return true;
    if (usageList.includes(questionId)) return true;
    if (usageList.length < limit) return true;
    return false;
  };

  /**
   * Records a question attempt (simulated check).
   * In the new secure flow, the backend does the actual recording/unlocking.
   * This function primarily serves to validate if we can proceed to navigation.
   */
  const recordAttempt = (questionId) => {
    if (canAccess(questionId)) {
      return true;
    }
    // Limit reached and not unlocked
    console.warn(`Free limit reached for ${backendKey}`);
    return false;
  };

  return {
    attemptedQuestions: usageList,
    isPremium,
    limitReached: !isPremium && usageList.length >= limit,
    remainingAttempts: Math.max(0, limit - usageList.length),
    canAccess,
    recordAttempt,
  };
};

export default useFreeLimit;

/**
 * Popular companies list with their domain for logo fetching.
 * Uses Clearbit Logo API — free, no token required.
 * Logo URL: https://logo.clearbit.com/{domain}
 */

export const COMPANIES = [
  // Indian IT & PSU
  { name: "TCS", domain: "tcs.com" },
  { name: "Infosys", domain: "infosys.com" },
  { name: "Wipro", domain: "wipro.com" },
  { name: "HCL", domain: "hcltech.com" },
  { name: "Tech Mahindra", domain: "techmahindra.com" },
  { name: "Accenture", domain: "accenture.com" },
  { name: "Cognizant", domain: "cognizant.com" },
  { name: "Capgemini", domain: "capgemini.com" },
  { name: "L&T", domain: "larsentoubro.com" },
  { name: "BHEL", domain: "bhel.com" },
  { name: "ISRO", domain: "isro.gov.in" },
  { name: "DRDO", domain: "drdo.gov.in" },
  { name: "NTPC", domain: "ntpc.co.in" },
  { name: "ONGC", domain: "ongcindia.com" },
  { name: "HAL", domain: "hal-india.co.in" },
  { name: "BSNL", domain: "bsnl.co.in" },
  { name: "Tata Motors", domain: "tatamotors.com" },
  { name: "Tata Steel", domain: "tatasteel.com" },
  { name: "Mahindra", domain: "mahindra.com" },
  { name: "Bajaj Auto", domain: "bajajauto.com" },
  { name: "Maruti Suzuki", domain: "marutisuzuki.com" },
  { name: "Hero MotoCorp", domain: "heromotocorp.com" },
  { name: "Reliance", domain: "ril.com" },
  { name: "Bosch", domain: "bosch.com" },
  { name: "Siemens", domain: "siemens.com" },
  { name: "ABB", domain: "abb.com" },
  { name: "Honeywell", domain: "honeywell.com" },
  { name: "Samsung", domain: "samsung.com" },
  { name: "Qualcomm", domain: "qualcomm.com" },
  { name: "Intel", domain: "intel.com" },
  { name: "Texas Instruments", domain: "ti.com" },
  { name: "Cisco", domain: "cisco.com" },
  { name: "IBM", domain: "ibm.com" },
  // Global MAANG
  { name: "Google", domain: "google.com" },
  { name: "Amazon", domain: "amazon.com" },
  { name: "Apple", domain: "apple.com" },
  { name: "Microsoft", domain: "microsoft.com" },
  { name: "Meta", domain: "meta.com" },
  { name: "Netflix", domain: "netflix.com" },
  { name: "Adobe", domain: "adobe.com" },
  { name: "Uber", domain: "uber.com" },
  { name: "Airbnb", domain: "airbnb.com" },
  { name: "Twitter", domain: "x.com" },
  { name: "LinkedIn", domain: "linkedin.com" },
  { name: "Salesforce", domain: "salesforce.com" },
  { name: "Oracle", domain: "oracle.com" },
  { name: "SAP", domain: "sap.com" },
  { name: "Nvidia", domain: "nvidia.com" },
  { name: "AMD", domain: "amd.com" },
  { name: "Flipkart", domain: "flipkart.com" },
  { name: "Paytm", domain: "paytm.com" },
  { name: "Zomato", domain: "zomato.com" },
  { name: "Swiggy", domain: "swiggy.in" },
  { name: "BYJU'S", domain: "byjus.com" },
  { name: "Ola", domain: "olacabs.com" },
  { name: "Razorpay", domain: "razorpay.com" },
  { name: "Freshworks", domain: "freshworks.com" },
];

/**
 * Clearbit Logo API — free, no token, returns real company logos
 * Usage: https://logo.clearbit.com/google.com
 */
export const getLogoUrl = (domain) => `https://logo.clearbit.com/${domain}`;

/**
 * Find company info by name (case-insensitive, partial match supported)
 */
export const findCompany = (name) => {
  if (!name) return null;
  const lower = name.toLowerCase().trim();
  return (
    // exact match first
    COMPANIES.find((c) => c.name.toLowerCase() === lower) ||
    // then partial match
    COMPANIES.find(
      (c) =>
        lower.includes(c.name.toLowerCase()) ||
        c.name.toLowerCase().includes(lower),
    )
  );
};

/**
 * Get logo URL by company name
 */
export const getLogoByName = (name) => {
  const company = findCompany(name);
  return company ? getLogoUrl(company.domain) : null;
};

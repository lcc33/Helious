export async function fetchContractSource(address: string): Promise<{
  source: string;
  name: string;
}> {
  const apiKey = process.env.ETHERSCAN_API_KEY;

  // Etherscan v2 API
  const url = `https://api.etherscan.io/v2/api?chainid=1&module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 0 } });

  if (!res.ok) throw new Error(`Etherscan request failed: ${res.status}`);

  const data = await res.json();

  // v2 still returns status "1" for success but error messages differ
  if (data.status !== "1") {
    throw new Error(
      data.result === "Contract source code not verified"
        ? "This contract's source code is not verified on Etherscan. Only verified contracts can be analyzed."
        : data.message || "Contract not found on Etherscan."
    );
  }

  const result = data.result?.[0];

  if (!result) throw new Error("No contract data returned.");

  if (!result.SourceCode || result.SourceCode === "") {
    throw new Error("Source code not verified. Only verified contracts can be analyzed.");
  }

  return {
    source: result.SourceCode.slice(0, 8000),
    name: result.ContractName || "Unknown Contract",
  };
}

// satisfy.ts  (NO imports from remoteAppManager or barrels!)

/* ... keep all your regex/constants and helpers exactly as-is ... */

const parseRange = (range: string): string => {
  // Remove any leading/trailing whitespace and normalize spaces
  return range.trim().replace(/\s+/g, ' ');
};

const parseComparatorString = (str: string): string => {
  // Handle various comparator formats
  return str.replace(/^(\^|~|>|<|=)/, '$1').trim();
};

const parseGTE0 = (cmp: string): string => {
  // Parse greater than or equal to zero patterns
  const match = cmp.match(/^([><=^~]*)(.*)$/);
  return match ? match[2] : cmp;
};

const extractComparator = (str: string): RegExpMatchArray | null => {
  // Extract version components from comparator strings
  return str.match(/^([><=^~]*)\s*(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.-]+))?$/);
};

const combineVersion = (major: string, minor: string, patch: string, preRelease?: string): string => {
  let version = `${major}.${minor}.${patch}`;
  if (preRelease) {
    version += `-${preRelease}`;
  }
  return version;
};

const compare = (rangeAtom: any, versionAtom: any): boolean => {
  // Compare version atoms according to semver rules
  const rangeVersion = rangeAtom.version.split('.').map(Number);
  const versionVersion = versionAtom.version.split('.').map(Number);

  // Compare major, minor, patch
  for (let i = 0; i < 3; i++) {
    if (versionVersion[i] > rangeVersion[i]) return rangeAtom.operator !== '<';
    if (versionVersion[i] < rangeVersion[i]) return rangeAtom.operator === '<';
  }

  // Handle pre-release versions
  if (rangeAtom.preRelease && versionAtom.preRelease) {
    const rangePre = rangeAtom.preRelease.map((x: string) => isNaN(Number(x)) ? x : Number(x));
    const versionPre = versionAtom.preRelease.map((x: string) => isNaN(Number(x)) ? x : Number(x));

    for (let i = 0; i < Math.max(rangePre.length, versionPre.length); i++) {
      const rangePart = rangePre[i];
      const versionPart = versionPre[i];

      if (rangePart === undefined) return true; // version has more pre-release parts
      if (versionPart === undefined) return false; // range has more pre-release parts

      if (typeof rangePart === 'number' && typeof versionPart === 'string') return false;
      if (typeof rangePart === 'string' && typeof versionPart === 'number') return true;

      if (rangePart > versionPart) return false;
      if (rangePart < versionPart) return true;
    }
  }

  return true;
};

// ✅ Hoisted export — safe to be referenced after module linking, before TDZ would apply
export function satisfy(version: string, range: string): boolean {
  if (!version) return false;

  const parsedRange = parseRange(range);
  const parsedComparator = parsedRange
    .split(" ")
    .map((rv) => parseComparatorString(rv))
    .join(" ");

  const comparators = parsedComparator
    .split(/\s+/)
    .map((cmp) => parseGTE0(cmp));

  const extractedVersion = extractComparator(version);
  if (!extractedVersion) return false;

  const [, versionOperator, , versionMajor, versionMinor, versionPatch, versionPreRelease] =
    extractedVersion;

  const versionAtom = {
    operator: versionOperator,
    version: combineVersion(versionMajor, versionMinor, versionPatch, versionPreRelease),
    major: versionMajor,
    minor: versionMinor,
    patch: versionPatch,
    preRelease: versionPreRelease == null ? undefined : versionPreRelease.split("."),
  };

  for (const cmp of comparators) {
    const extractedComparator = extractComparator(cmp);
    if (!extractedComparator) return false;

    const [, rangeOperator, , rangeMajor, rangeMinor, rangePatch, rangePreRelease] =
      extractedComparator;

    const rangeAtom = {
      operator: rangeOperator,
      version: combineVersion(rangeMajor, rangeMinor, rangePatch, rangePreRelease),
      major: rangeMajor,
      minor: rangeMinor,
      patch: rangePatch,
      preRelease: rangePreRelease == null ? undefined : rangePreRelease.split("."),
    };

    if (!compare(rangeAtom, versionAtom)) return false;
  }
  return true;
}

// Optional: keep the minified/bundled name if other code imports { wt }
export { satisfy as wt };
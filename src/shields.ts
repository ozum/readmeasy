const badges = require("badges"); // eslint-disable-line @typescript-eslint/no-var-requires

const additionalShields: Record<string, string> = {
  conventionalcommits:
    "[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)",
  commitizen:
    "[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)",
};

function badgesConfig(packageJson: Record<string, any>): { homepage: string; npmPackageName: string } {
  return {
    homepage: packageJson.homepage,
    npmPackageName: packageJson.name,
    ...packageJson.identities,
  };
}

export default function shields(packageJson: Record<string, any>): string {
  const config = badgesConfig(packageJson);
  const requestedShields: string[] = packageJson.shields || [];
  return requestedShields.map(shieldName => additionalShields[shieldName] || badges.renderBadges([shieldName], config)).join("\n");
}

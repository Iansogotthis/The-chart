{pkgs}: {
  deps = [
    pkgs.haskellPackages.dotenv_0_12_0_0
    pkgs.nodePackages_latest.dotenv-cli
    pkgs.nodePackages_latest.npm
    pkgs.nodejs_latest
    pkgs.rPackages.firebase
  ];
}

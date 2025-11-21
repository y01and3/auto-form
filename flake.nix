{
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs = inputs:
    inputs.flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = (import (inputs.nixpkgs) { inherit system; });
      in {
        devShell = pkgs.mkShell {
          buildInputs=[
            pkgs.nodejs_24
          ];

          shellHook = ''
            mkdir -p $PWD/.nix-node-bin
            echo '*' > $PWD/.nix-node-bin/.gitignore

            export PATH=$PWD/.nix-node-bin:$PATH

            corepack enable --install-directory $PWD/.nix-node-bin
          '';
        };
      }
    );
}

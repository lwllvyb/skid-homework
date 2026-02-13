# vim:fileencoding=utf-8:foldmethod=marker
#: Tip: If you are using (n)vim, you can press zM to fold all the config blocks quickly (za to fold under cursor)
#: Tip: search keywords to start quickly
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    blackbox.url = "github:cubewhy/blackbox-flakes";
  };

  outputs = {
    self,
    blackbox,
    nixpkgs,
    ...
  }: let
    overlays = [];
  in {
    devShells =
      blackbox.lib.eachSystem {
        inherit nixpkgs overlays;
      } (pkgs: {
        default = blackbox.lib.mkShell {
          inherit pkgs;

          #: Config {{{
          config = {
            #: Languages {{{

            #: Javascript/Typescript {{{
            blackbox.languages.javascript = {
              enable = true;
              package.nodejs = pkgs.nodejs-slim;
              manager = "pnpm";
              autoInstall = true;
            };
            #: }}}

            #: Tools {{{
            blackbox.tools.pre-commit = {
              enable = false;
            };
            #: }}}
          };
          #: }}}

          #: mkShell builtin options are available
          # shellHook = ''
          # '';
        };
      });
  };
}

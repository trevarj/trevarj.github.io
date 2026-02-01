# [BOSS] Bitcoin Core Dev Build with Guix
<!-- %TIMESTAMP=1769864331% -->

<sub>No AI was used to write this post.</sub>

## Intro

I just recently finished up the first month of the 2026 [BOSS
Challenge](https://bosschallenge.xyz/), which is a multi-month initiative,
hosted by Chaincode Labs, to get people interested in Bitcoin open-source
software (BOSS) development. It consists of programming challenges and open
source contributions to projects in the Bitcoin ecosystem.

In the first challenge, you are required to build Bitcoin Core and run tests. In
the remaining challenges you need to use Bitcoin Core to complete tasks. I've
already built it before using Guix, so I was well-prepared, such that I only had
to copy over a few files from my bitcoin fork.

Using Guix as a package manager to build Bitcoin Core for development fits
perfectly, because actual Core builds already [use
Guix](https://github.com/bitcoin/bitcoin/tree/master/contrib/guix) for its
reproducible nature and
[bootstrapability](https://guix.gnu.org/blog/2023/the-full-source-bootstrap-building-from-source-all-the-way-down/)
(see this [presentation by Carl
Dong](https://www.youtube.com/watch?v=I2iShmUTEl8)).


## Building Bitcoin Core with Guix for development use

### Requirements

- [Guix](https://guix.gnu.org/manual/1.4.0/en/html_node/Installation.html) - the package manager
- [direnv](https://direnv.net/docs/installation.html) - for per directory environments

You can ignore `direnv` and the `.envrc` file if you just want to use `guix
shell` instead. Direnv will automatically call `guix shell` for you when you
enter the directory. This is really useful for editor integration so the editor
can get the correct environment, or just to set some env vars automatically.


### Setup Steps

We will put the `manifest.scm` and `.envrc` in a parent dir "bitcoin-dev", so
that we don't need to track these files in the `bitcoin` repo.

```sh
$ mkdir bitcoin-dev && cd bitcoin-dev
$ git clone git@github.com:bitcoin/bitcoin.git
$ cd bitcoin
```

Create an `.envrc` (optional)
```sh
use guix
```

Create `manifest.scm`
```scheme
(use-modules (gnu packages))

(specifications->manifest
 (list
  ;; Build tools
  "make" "automake" "autoconf" "cmake" "libtool"
  ;; Toolchains
  "gcc-toolchain@14"
  "clang"
  ;; Extras
  "perl"
  "pkg-config"
  "python"
  "qttools@5.15"
  "util-linux"

  ;; Bitcoin dependencies
  "boost"
  "capnproto"
  "libevent"
  "qtbase@5"
  "sqlite"
  "zeromq"))
```

I'm using clang to build cause it seems to be faster and more efficient with
memory. Still need gcc for some libs.

### Direnv

Press "Enter" and you should see direnv tell you to `direnv allow` and then
"Enter" again so it loads the environment. This will take a while the first time
because Guix will be pulling in dependencies.

### Guix Shell

If you don't have direnv, or don't want to use it, you can just do `guix shell`
in the `bitcoin-dev/` directory and it will give you a shell that has the
environment from `manifest.scm`.

### Building Bitcoin Core

For building, you can refer to the `doc/build-unix.md` file for specific parameters, but I'm using this:
```sh
$ cmake -B build -DCMAKE_CXX_COMPILER=clang++ -DCMAKE_C_COMPILER=clang -DENABLE_WALLET=ON -DWITH_ZMQ=ON
$ cmake --build build
# wait a while for build to complete
```

After that completes, you will find `bitcoind`, `bitcoin-cli` and others inside
`build/bin`.

You can update your PATH variable in an `.envrc` of another project
that may require using one of them, like with the BOSS challenges.

Pretty easy and no hunting for dependencies on your specific distro.

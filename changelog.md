# Architect Deploy changelog

---

## [1.7.1] 2020-05-17

### Changed

- Updated direct deployment copy, added warning
- Updated dependencies

---

## [1.7.0] 2020-05-10

### Added

- Deploy can now deploy directly deploy single functions or groups of functions to Lambda by providing a path; examples:
  - `arc deploy src` will dirty deploy all of `./src`
  - `arc deploy src/http` will dirty deploy all of `./src/http`
  - `arc deploy src/events/foo` will dirty deploy `./src/events/foo`
  - As a reminder: direct deployments should be considered temporary / for testing only, and will be overwritten by any deployments coming in from a proper full deploy operation
  - Fixes #625, shout out to @filmaj for this awesome feature! 🔥

---

## [1.6.1] 2020-04-16

### Added

- Added Sandbox watcher pausing
  - Writes an empty `_pause-architect-sandbox-watcher` file in your operating system's `$TMP` directory (usually `/tmp` or `c:\windows\temp`) which temporarily pauses the Sandbox watcher
  - This means Sandbox can remain open during deploys and neither should interfere with the other
- Allow disabling Architect's CDN checks / processes so user can configure / manage their own CDNS via Macros; fixes #750, thanks @jgallen23!
  - Syntax: `@cdn false` || `@cdn disable` || `@cdn disabled`


### Changed

- Updated dependencies


### Fixed

- Fixed issue where custom named deployments (`deploy --name`) wouldn't work with `static`; fixes #759, thanks @jgallen23!
- Fixed issue where deploying static assets may deploy to the wrong bucket if additional buckets are defined in Macros; fixes #750, thanks @clintjhill + @jgallen23!

---

## [1.6.0] 2020-03-22

### Added

- Added early support for HTTP APIs (currently only via Macro)

---

## [1.5.4] 2020-03-22

### Changed

- Updated dependencies

---

## [1.5.2 - 1.5.3] 2020-03-19

### Changed

- Ensures hydration occurs before macros in the deploy process, enabling macros to mutate dependencies and shared files during a deploy
- Updated dependencies

---

## [1.5.1] 2020-02-13

### Changed

- Updated dependencies

---

## [1.5.0] 2020-02-05

### Added

- Dry-run flag: `deploy --dry-run`
  - Test your `@macros`, function hydration, CloudFormation / SAM template files, and other deployment-related operations without actually building any live infra
  - Dry-run mode runs through all deploy operations necessary to generate your app's CloudFormation / SAM template files
  - **Heads up:** the AWS CLI requires a live, active S3 bucket to generate your app's templates; however no **live infra will be created** from these templates


### Changed

- Updated dependencies

---

## [1.4.0] 2020-01-13

### Added

- If no deployment bucket is specified, Deploy now automatically creates one for you
  - If a deployment bucket was automatically created before, but no longer exists (or access is no longer available), a new bucket will be created and your app's configuration will be updated
  - This also means the `@aws` pragma is no longer stricly necessary to deploy to AWS with Architect

---

## [1.3.3] 2020-01-07

### Changed

- Updated dependencies

---

## [1.3.1 - 1.3.2] 2019-12-28

TODO

---

## [1.3.0] 2019-12-14

### Added

- Adding `--name` for creating a unique stack name. (Aliased to `-n` and `name`.)
- Adding `--tags` for adding tags to the CloudFormation stack.

---

## [1.2.14] 2019-12-12

### Changed

- Updated dependencies

---

## [1.2.13] 2019-12-01

### Changed

- Now prints WebSockets URLs upon deployment, thanks @jessehattabaugh!


### Fixed

- Fixes regression related `staging` and `production` WebSockets names and paths, thanks @jessehattabaugh!
  - WebSockets APIs named `${appname}Websocket` are now named `${appname}Websocket${stage}` (like `@http` APIs)
  - `production` WebSockets paths now correctly reflect the production stage (e.g. `longawsurl.com/production`)

---

## [1.2.12] 2019-12-02

### Added

- Adds `CAPABILITY_AUTO_EXPAND` for nested stack deployments; fixes #436, thanks @jgallen23!

---

## [1.2.11] 2019-11-19

### Changed

- Updated dependencies


### Fixed

- Fixed potential CloudFront error related to destructuring; thanks @roxeteer!

---

## 1.2.9 - 1.2.10 TBD

---

## [1.2.8] 2019-10-17

### Changed

- Internal change: swapped out `utils/init` for `@architect/create`
- Updated dependencies

---

## [1.2.7] 2019-10-17

### Fixed

- Fixes failed deploys if file type is known by common mime-type database; resolves #56, thanks @mikemaccana!
- Fixes paths for deployment of assets on Windows; resolves #58, thanks @mikemaccana!

---

## [1.2.5 - 1.2.6] 2019-10-15

### Fixed

- Fixed deployment issue if `get /` is not specified in `@http`; resolves @package#27, /ht @grahamb and @jeffreyfate!

---

## [1.2.4] 2019-10-11

### Changed

- Updated dependencies

---

## [1.2.3] 2019-10-10

### Added

- Added support for `@static fingerprint true` in root spa / proxy function deployments


### Changed

- Moved fingerprint operations into a pre-CloudFormation step
- Internal refactor to sam

---

## [1.2.2] 2019-10-10

### Changed

- Ensures html / json are published to S3 with anti-cache headers


### Fixed

- Restores static asset pruning

---

## [1.2.1] 2019-10-09

### Added

- Cleans up temp directory left by `package` when using root proxy + fingerprint


### Changed

- Now uses `@architect/http-proxy` instead of manually vendored root proxy file
- Updated dependencies

---

## [1.2.0] 2019-10-03

### Added

- Automatic `@cdn` invalidation every deploy (similar behavior to 3rd party CDNs); CloudFront gives you 1000 free invalidations/mo

## [1.1.5 - 1.1.6] 2019-10-02

### Fixed

- Fixed issue where with `@static fingerprint true` enabled, the `static.json` file would not be copied into deployed functions' shared dirs; fixes #43, thanks @dawnerd + @jgallen23!
- Removed `eslint` from production dependencies


### Changed

- Updated dependencies

---

<!-- TODO backfill, please! -->

---

## [1.0.4]

### Added

- `changelog.md` _meta_
- New `@static` config option: `folder` to override `public`

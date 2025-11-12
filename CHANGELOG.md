# Changelog

## 1.0.0 (2025-11-12)


### ⚠ BREAKING CHANGES

* migrate from npm to pnpm
* **note:** `contents` is no longer supported in frontmatter, use `toc` instead.

### Features

* add configurable weeks for heatmap ([4369dd5](https://github.com/tuyuritio/astro-theme-thought-lite/commit/4369dd5434e4aa7aa76fa5736d27d4b3ff484c94))
* add gaps for heatmap items ([f3f52a5](https://github.com/tuyuritio/astro-theme-thought-lite/commit/f3f52a588d394b67f9bebe9194792525d4f6b50d))
* add interactive CLI script for creating new content ([dadd562](https://github.com/tuyuritio/astro-theme-thought-lite/commit/dadd562ca76001e898323a39de03d1f76f3a74cf))
* add latest content config and empty state messages ([1914d7e](https://github.com/tuyuritio/astro-theme-thought-lite/commit/1914d7e3c4efa085d8c988ec499948944b18cb17))
* add policy page ([fc16600](https://github.com/tuyuritio/astro-theme-thought-lite/commit/fc16600ea6f83028f77cbfc6e57787296ef27f21))
* add prologue and home logo to site configuration ([f98cdbf](https://github.com/tuyuritio/astro-theme-thought-lite/commit/f98cdbfa3546356c5f7bd55ac683d7bfff31d953))
* add section configuration for feed items ([d1a15ca](https://github.com/tuyuritio/astro-theme-thought-lite/commit/d1a15ca3e424315c76046e8c684f6139a9b77851))
* add sensitive content handling ([27eb74d](https://github.com/tuyuritio/astro-theme-thought-lite/commit/27eb74d9833ec7c30d0545196ae538b084927b8b))
* add total word count in footer ([9b3ca20](https://github.com/tuyuritio/astro-theme-thought-lite/commit/9b3ca20436222cd80aed49f1d7fb83e06718be7d))
* **comment:** add sorting and reload functionality ([b1078d7](https://github.com/tuyuritio/astro-theme-thought-lite/commit/b1078d74b56a416b4bedaa85571d3618a58d45bb))
* **comment:** support soft‑line‑breaks ([b07be59](https://github.com/tuyuritio/astro-theme-thought-lite/commit/b07be591993f14f67bbb4e664dbc65a51c9d4be7))
* **config:** migrate site configuration to TypeScript ([183c99e](https://github.com/tuyuritio/astro-theme-thought-lite/commit/183c99e6eb04177002d04916271b7b626987dfcf))
* enable manual triggering of release workflow ([f3dcbbe](https://github.com/tuyuritio/astro-theme-thought-lite/commit/f3dcbbe8f808904c579d031c53c9df1d8548264c))
* enhance comment to support unauthenticated users ([3e68d90](https://github.com/tuyuritio/astro-theme-thought-lite/commit/3e68d90c85a1c22e148b0600f632d8d3fee8fe9b))
* enhance JWT token verification with renewal ([baf4758](https://github.com/tuyuritio/astro-theme-thought-lite/commit/baf47584b1d98442b8fd59aba0d0f479c5c4d79e))
* **feed:** add configurable feed item limit ([cfa3f47](https://github.com/tuyuritio/astro-theme-thought-lite/commit/cfa3f4764d7cdd895ab3df7cff3b03b5e92f2b68))
* **feed:** add feed styles ([cfa3f47](https://github.com/tuyuritio/astro-theme-thought-lite/commit/cfa3f4764d7cdd895ab3df7cff3b03b5e92f2b68))
* **feed:** remove RSS and JSON feeds ([cfa3f47](https://github.com/tuyuritio/astro-theme-thought-lite/commit/cfa3f4764d7cdd895ab3df7cff3b03b5e92f2b68))
* **i18n:** add monolocale integration ([277abe6](https://github.com/tuyuritio/astro-theme-thought-lite/commit/277abe67b2e61ab2fb93402ca0c1356a93efeb7f))
* **i18n:** implement monolocale support ([f703a40](https://github.com/tuyuritio/astro-theme-thought-lite/commit/f703a4083bd705e69a7784cba35b0d42aa10a029))
* **i18n:** implement multilingual support for content creation script ([64acaf4](https://github.com/tuyuritio/astro-theme-thought-lite/commit/64acaf4745200d3e00b0c7f4dc86b22b56d14004))
* identify feed locale via params and add sensitive content support to feed links ([8aff229](https://github.com/tuyuritio/astro-theme-thought-lite/commit/8aff22947eb860fa5f27d81d6eb8d1203c816629))
* init ([feeec6d](https://github.com/tuyuritio/astro-theme-thought-lite/commit/feeec6d20b78b84da507aac62b38e76d73c08c4c))
* **jotting:** add content word count ([5feda34](https://github.com/tuyuritio/astro-theme-thought-lite/commit/5feda345bafcf659250033a68e2d6b532085d0f5))
* **jotting:** add top priority field ([df8c3dd](https://github.com/tuyuritio/astro-theme-thought-lite/commit/df8c3ddad6d839d52705bfcf2e559f3a9bf200d9))
* **jotting:** integrate comments section in jottings ([d54101f](https://github.com/tuyuritio/astro-theme-thought-lite/commit/d54101f889aba163f777560e7527945abc22f6fe))
* **note:** add reading time prediction ([e0cafe5](https://github.com/tuyuritio/astro-theme-thought-lite/commit/e0cafe50c8c499d5915495c6dd3e7053ca148260))
* **note:** add top priority field ([51b5b3e](https://github.com/tuyuritio/astro-theme-thought-lite/commit/51b5b3e52550987d6f92cb5acfd437b013da34f1))
* optionally show newest jotting and note on homepage ([1867264](https://github.com/tuyuritio/astro-theme-thought-lite/commit/1867264e43db1dd77520cc6949fafe4abe58001a))
* replace SSR with CSR for list filtering ([3d374c8](https://github.com/tuyuritio/astro-theme-thought-lite/commit/3d374c89617a98caf609fe5d11a86b231925d8be))
* staticize error pages ([778bd9e](https://github.com/tuyuritio/astro-theme-thought-lite/commit/778bd9e194d7afb58bb6db212a4e07f80e8481f3))


### Bug Fixes

* add aria-label to Icon ([9d484e4](https://github.com/tuyuritio/astro-theme-thought-lite/commit/9d484e4a50c6cb44f3b83e5d6bb0c6e4b8cfc26f))
* add aria-labels to positioning buttons ([e03dc13](https://github.com/tuyuritio/astro-theme-thought-lite/commit/e03dc13987fd4fa68d50c0328e49ff3f79345311))
* add benefits description for OAuth ([78fe7e7](https://github.com/tuyuritio/astro-theme-thought-lite/commit/78fe7e78b8f0c7f113f7a102945de2599e3ccde5))
* add cursive font for CJK ([ca60790](https://github.com/tuyuritio/astro-theme-thought-lite/commit/ca60790578b573c7e14cdd6f398463493cf3cd48))
* add language-specific font support ([9918b9a](https://github.com/tuyuritio/astro-theme-thought-lite/commit/9918b9abf8de260e1ed78a4919e81314e79261e7))
* add missing paginator styles ([249d39b](https://github.com/tuyuritio/astro-theme-thought-lite/commit/249d39b0fadedd7f56fcd9ddb0cef191cc201b27))
* add transition for sensitive contents ([334a55e](https://github.com/tuyuritio/astro-theme-thought-lite/commit/334a55e3447c6a9cdfd8c9cbdf2e921cb5226591))
* add workaround for dependency optimization ([b574724](https://github.com/tuyuritio/astro-theme-thought-lite/commit/b57472477b23bc5bfc0e4dbb6fd775a897991ae7))
* avoid overflow of navigator menu ([6d1fc79](https://github.com/tuyuritio/astro-theme-thought-lite/commit/6d1fc7958652fd76b08a5db4abcafe0243d50bd2))
* check if policy file exists and render footer conditionally ([5fb894d](https://github.com/tuyuritio/astro-theme-thought-lite/commit/5fb894d5baab03474bbf3af7b18ee5d605b1a5f4))
* **comment:** add animation ([3112afb](https://github.com/tuyuritio/astro-theme-thought-lite/commit/3112afbf09db5ad0b85b2354594dcb1e8bd24aa1))
* **comment:** add title to markdown preview icon ([e74f58b](https://github.com/tuyuritio/astro-theme-thought-lite/commit/e74f58bbc61810a04e68d4edb09017d22d1faea1))
* **comment:** adjust emoji layout for better responsiveness ([7ac262e](https://github.com/tuyuritio/astro-theme-thought-lite/commit/7ac262ee491231545ae8b8f150b07b1a40d2bea7))
* **comment:** check drifter by  drifter.ID ([5621912](https://github.com/tuyuritio/astro-theme-thought-lite/commit/56219128c5038b2bf7d2776228530ff86d99e3c8))
* **comment:** enhance preview section with empty state message ([c103df3](https://github.com/tuyuritio/astro-theme-thought-lite/commit/c103df33c4d710fae84eb746ff03a6f08f894cde))
* **comment:** inline loading icons ([eabb0db](https://github.com/tuyuritio/astro-theme-thought-lite/commit/eabb0dbeab134859b853990db7c5ef4df2dc340b))
* **comment:** integrate Turnstile site key into component ([65e7826](https://github.com/tuyuritio/astro-theme-thought-lite/commit/65e7826759b38be825a72a6e7fe5770d5768191a))
* **comment:** update  mobile layout indentation ([219bf95](https://github.com/tuyuritio/astro-theme-thought-lite/commit/219bf95af40927b0cfff88e6bcba7b930a54423a))
* **comment:** update alt text ([f79e6e6](https://github.com/tuyuritio/astro-theme-thought-lite/commit/f79e6e6c2123c038b4801a5100cc47b8dbdc27c7))
* **comment:** update tip type on successful share ([52e677b](https://github.com/tuyuritio/astro-theme-thought-lite/commit/52e677ba2c0db94ac1fbcd35528e59d1312b59b4))
* **config:** add imageService option to cloudflare adapter ([71a7fc8](https://github.com/tuyuritio/astro-theme-thought-lite/commit/71a7fc807a5941b6338e606f29e141b7dd0c7815))
* **config:** change latest content display configuration ([fabb973](https://github.com/tuyuritio/astro-theme-thought-lite/commit/fabb973743622f99a01cc96e2e44f0fa23d407cf))
* **config:** correct uniqueItems placement ([17ee92b](https://github.com/tuyuritio/astro-theme-thought-lite/commit/17ee92bcd1649853e519886a4c864719d20f1890))
* **config:** simplify author structure ([73ca403](https://github.com/tuyuritio/astro-theme-thought-lite/commit/73ca4037982c639a6b8bf81eb7a79f091464e020))
* **config:** update `latest` configuration ([ac1f90b](https://github.com/tuyuritio/astro-theme-thought-lite/commit/ac1f90b49394a57d792ce8c9aebb1ff6a9f7eb75))
* consolidate font links ([a70a3fd](https://github.com/tuyuritio/astro-theme-thought-lite/commit/a70a3fdb5916521e4c454dc7788a377807302a77))
* content inclusion condition ([c582139](https://github.com/tuyuritio/astro-theme-thought-lite/commit/c5821396665672d161235ad9470c3d4b09b56b2f))
* correct collection name ([b75a25a](https://github.com/tuyuritio/astro-theme-thought-lite/commit/b75a25ae3c93523a23817c33f141e23963c5c3d7))
* correct SPA loading issue on policy page ([14ab7ea](https://github.com/tuyuritio/astro-theme-thought-lite/commit/14ab7ea82da36c8b9f3994e2b57d102df32c15d8))
* display user timezone for comments ([6d0cea2](https://github.com/tuyuritio/astro-theme-thought-lite/commit/6d0cea280a25f0e28822f1609017201d69b1a74e))
* **drifter:** handle null name in user profile query ([2b13631](https://github.com/tuyuritio/astro-theme-thought-lite/commit/2b13631176baaac3038f081f4c7e8325fc9a0ae3))
* **drifter:** return profile data directly ([5919fe8](https://github.com/tuyuritio/astro-theme-thought-lite/commit/5919fe89a3c5c580566fe1bd29c0005ba4321b38))
* enhance CJK support for remark ([5dd5168](https://github.com/tuyuritio/astro-theme-thought-lite/commit/5dd5168dfb85523657e7e676d1eb0b2b536fdcb1))
* enhance URL building ([d1e9422](https://github.com/tuyuritio/astro-theme-thought-lite/commit/d1e9422d9b56be31f7f891e8d5fd942ae4bad3b9))
* **feed:** add description to items ([432cc99](https://github.com/tuyuritio/astro-theme-thought-lite/commit/432cc990ae8716f2d7269dfa1db151ee90b5b387))
* **feed:** adopt Astro container (experimental) for rendering markdown images ([874db37](https://github.com/tuyuritio/astro-theme-thought-lite/commit/874db3741c0c4b872638ffd3ee8eaadec29ec779))
* **feed:** change link from `/feed` to `/feed.xml` ([b90b6e3](https://github.com/tuyuritio/astro-theme-thought-lite/commit/b90b6e3adfc3c5e5448f6cea64e5a627eda36468))
* **feed:** improve locale handling ([46ca019](https://github.com/tuyuritio/astro-theme-thought-lite/commit/46ca0193232402b348778d9e84a2ef6368ccf5e8))
* **feed:** update feed URL in XSLT ([46c3c13](https://github.com/tuyuritio/astro-theme-thought-lite/commit/46c3c130f440d7fb6b40c97de0b61f1d058a5c45))
* filtered URL not applied correctly ([affd1ff](https://github.com/tuyuritio/astro-theme-thought-lite/commit/affd1ff6d5884444ac194d7028a242bd2fb830e6))
* **fmt:** add prettier plugins ([13b3cc7](https://github.com/tuyuritio/astro-theme-thought-lite/commit/13b3cc7e0781b0a1b58b67a93f46672abb387a94))
* **footer:** add title for policy link ([3e3c697](https://github.com/tuyuritio/astro-theme-thought-lite/commit/3e3c697c25cfe7f69bd86cb337c1e5866c38345f))
* **footer:** add title for theme link ([bb21725](https://github.com/tuyuritio/astro-theme-thought-lite/commit/bb21725b82573d46b1aa4f9ea9190601673373cd))
* **footer:** update icon imports and vertically center icons ([8ba882a](https://github.com/tuyuritio/astro-theme-thought-lite/commit/8ba882a5ad5048f7ad8571f92cef524ead37ab57))
* **footer:** update layout and add link of theme ([03f5612](https://github.com/tuyuritio/astro-theme-thought-lite/commit/03f5612aea4bdd24d49ec279777f8d467a8f902f))
* handle rendering fallback for information ([cb7543b](https://github.com/tuyuritio/astro-theme-thought-lite/commit/cb7543bbb245c6860f62e97c7c78e0372767d8a9))
* **heatmap:** tooltip overflow ([deef172](https://github.com/tuyuritio/astro-theme-thought-lite/commit/deef172ae9f18f628ff6fefb1af7d4691edd72b0))
* **home:** adjust layout and visibility ([627fe36](https://github.com/tuyuritio/astro-theme-thought-lite/commit/627fe3691304a1ac45e0cbd66f1f9b70638ba5cb))
* **i18n:** adapt creation script for monolingual mode ([b1e63e0](https://github.com/tuyuritio/astro-theme-thought-lite/commit/b1e63e0537f5767b9c1272e22e3bc2318064a9f2))
* **i18n:** add multilocale constant ([ca28acf](https://github.com/tuyuritio/astro-theme-thought-lite/commit/ca28acfbd47635c0e853cf220cf963911d613828))
* **i18n:** remove astro-locales integration and replace imports ([e565f8a](https://github.com/tuyuritio/astro-theme-thought-lite/commit/e565f8a0c2b14f49009f8185686c7579255d2432))
* **i18n:** remove fallback to default locale ([83f2320](https://github.com/tuyuritio/astro-theme-thought-lite/commit/83f23201ce5720054d9d366414eacefe7a5fac67))
* **i18n:** update navigation keys ([f083da4](https://github.com/tuyuritio/astro-theme-thought-lite/commit/f083da49c7ab458bfad16636de58aa4b03ec5ee5))
* **i18n:** update validation messages for content ID ([28a355d](https://github.com/tuyuritio/astro-theme-thought-lite/commit/28a355d0155a1620ae57ef9c16fbfcf04e059d65))
* **icon:** add z-index to tooltip ([0ff02d8](https://github.com/tuyuritio/astro-theme-thought-lite/commit/0ff02d8715e202227ff671c68a998cb07bfb5d08))
* **icon:** adjust z-index for tooltip ([cf8f21f](https://github.com/tuyuritio/astro-theme-thought-lite/commit/cf8f21fe8622b1a848f9aeb476671eaf8c5fd870))
* implement dynamic navigation routes ([21d1941](https://github.com/tuyuritio/astro-theme-thought-lite/commit/21d1941c993a4a4d4cd354f67463cb6e244ad7ba))
* improve empty state handling ([eea4fc9](https://github.com/tuyuritio/astro-theme-thought-lite/commit/eea4fc9a0dea80d4f1683a0c125c28e5dfb56641))
* **information:** correct typo ([6618275](https://github.com/tuyuritio/astro-theme-thought-lite/commit/661827529ac7bc0618cbc8c1c89bd2ef4452b56d))
* **jotting, note:** extract only necessary properties ([c08f2ed](https://github.com/tuyuritio/astro-theme-thought-lite/commit/c08f2ed8efa47eef6f6689adb7800530698f383b))
* **jotting:** adjust border thickness ([25ffb7e](https://github.com/tuyuritio/astro-theme-thought-lite/commit/25ffb7edd21a80349d0791a7ff68da978087decb))
* **jotting:** adjust layout ([2cfe126](https://github.com/tuyuritio/astro-theme-thought-lite/commit/2cfe1261e9b57df3b95712904b2d4318f4f2b740))
* **jotting:** adjust layout ([69d39d6](https://github.com/tuyuritio/astro-theme-thought-lite/commit/69d39d649886d46af2b439ba273b0a2b74a4f8c9))
* **jotting:** hide tag icon when no tags ([3ad8bb4](https://github.com/tuyuritio/astro-theme-thought-lite/commit/3ad8bb4c9bd026fd6a7a448195d519adac6cf91a))
* **jotting:** progress circle not working ([96c1951](https://github.com/tuyuritio/astro-theme-thought-lite/commit/96c1951be9f50e9f5aa06ab2cbb757df82d0336a))
* **layout:** add z-index for preventing overlap ([53979ef](https://github.com/tuyuritio/astro-theme-thought-lite/commit/53979ef8e83e0d6de4688c1af87624034c24a5e0))
* **layout:** adjust flex layout for *about* page ([d5c61b9](https://github.com/tuyuritio/astro-theme-thought-lite/commit/d5c61b96f32eadb0fecc6b593749529aeefc5468))
* **layout:** adjust margin for footer ([d20eb78](https://github.com/tuyuritio/astro-theme-thought-lite/commit/d20eb780cd653e429cfddc27741aac58994e2793))
* **layout:** adjust position of Position component ([aea35d2](https://github.com/tuyuritio/astro-theme-thought-lite/commit/aea35d290b7fcf6d4dee6a05f9e9925633cf6a9e))
* **layout:** horizontally center feed icon ([568b0d5](https://github.com/tuyuritio/astro-theme-thought-lite/commit/568b0d50dfecc52ffdef22ef13ce5308f4477d4b))
* **layout:** prevent overflow of absolute elements ([ef2cea8](https://github.com/tuyuritio/astro-theme-thought-lite/commit/ef2cea81e736c936e8fd877755a095781d5f3cf5))
* **layout:** remove unnecessary height from sensitive warning ([4c02e5c](https://github.com/tuyuritio/astro-theme-thought-lite/commit/4c02e5cff25b8b1ddce61a18422c55b84be42b1d))
* **layout:** remove unnecessary margin ([c9b0edf](https://github.com/tuyuritio/astro-theme-thought-lite/commit/c9b0edffea9383dc0e045820724388387ad8e991))
* **layout:** swap positions of feed button and theme toggle button ([c675d17](https://github.com/tuyuritio/astro-theme-thought-lite/commit/c675d174f011c3f72037905820b76dafee253747))
* **markdown:** change mark style to wavy ([0df0c18](https://github.com/tuyuritio/astro-theme-thought-lite/commit/0df0c18b59eb05dbaba45473c5c2ffd60589c790))
* **markdown:** only hide anchor link in title ([5db7cab](https://github.com/tuyuritio/astro-theme-thought-lite/commit/5db7cab782247cb6549a47a4523854568176cde8))
* move word count to Markdown rendering stage ([fcd1f99](https://github.com/tuyuritio/astro-theme-thought-lite/commit/fcd1f99c21d60455789637ab2f8d99eaa291d2b9))
* no longer specify specific icons due to global staticization ([ccfd2c5](https://github.com/tuyuritio/astro-theme-thought-lite/commit/ccfd2c580344f3f925351cf512b458fc152e5898))
* **note:** remove reading time estimation ([871cac9](https://github.com/tuyuritio/astro-theme-thought-lite/commit/871cac9152d869f12162714483f358b83107944f))
* notification deletion ([12d1fa6](https://github.com/tuyuritio/astro-theme-thought-lite/commit/12d1fa66bc6794d240a419e1f321b737c096475b))
* **oauth:** set expiration for escort to 5 minutes ([3076739](https://github.com/tuyuritio/astro-theme-thought-lite/commit/3076739c3fbfa5674a83d902dd5f19706a36b147))
* prevent warning from notification type ([7d13746](https://github.com/tuyuritio/astro-theme-thought-lite/commit/7d137462b2e794a35c7f7e8ca84cb6242d4a584e))
* progress ring closes too early ([2ba1291](https://github.com/tuyuritio/astro-theme-thought-lite/commit/2ba1291ed0dc341eee3aa5277d296de4d9dc0afa))
* refactor latest content retrieval and fix type error ([e6aa8b6](https://github.com/tuyuritio/astro-theme-thought-lite/commit/e6aa8b61f9c3a14e499609ba23f5ead645f75c7e))
* remove claim section and related content from about page ([656420f](https://github.com/tuyuritio/astro-theme-thought-lite/commit/656420f1ff81f1323bea534731cf1f038fc46cfe))
* remove unused import of `getCollection` ([4c9c059](https://github.com/tuyuritio/astro-theme-thought-lite/commit/4c9c059247f0a2891a561f57bef50de53d6b11a8))
* remove web app manifest ([ab6ddc8](https://github.com/tuyuritio/astro-theme-thought-lite/commit/ab6ddc83327eed36a357466ba4b8654f7f5c2e9a))
* rename and minor fixes ([6e6b4cf](https://github.com/tuyuritio/astro-theme-thought-lite/commit/6e6b4cffd52de8d208273ddd130c63df2091b734))
* render `<time>` tooltip according to client language and timezone ([3a43906](https://github.com/tuyuritio/astro-theme-thought-lite/commit/3a43906700b698ff3d1729b29ece979f4899cce8))
* replace rehype-figure plugin with custom implementation ([8a94eb7](https://github.com/tuyuritio/astro-theme-thought-lite/commit/8a94eb7cf69575d29026201446d87c1115094806))
* set home icon as inline ([981be9b](https://github.com/tuyuritio/astro-theme-thought-lite/commit/981be9b16ede6a95e46259fa21fe944e6f5cef88))
* set initial values for list rendering ([6300997](https://github.com/tuyuritio/astro-theme-thought-lite/commit/630099735ec515347916d050b6424086dafd738c))
* shorten class name of unocss ([d4bccc0](https://github.com/tuyuritio/astro-theme-thought-lite/commit/d4bccc023a37c16c1c8ff3b50ec3ccb921bd8766))
* show a message when note or jotting is empty ([8c9736b](https://github.com/tuyuritio/astro-theme-thought-lite/commit/8c9736ba9c3ec84e4640ff8eba53bb806c3d014d))
* **style:** add hover effect for items in jotting and note list ([e2fbc48](https://github.com/tuyuritio/astro-theme-thought-lite/commit/e2fbc48dc4f701fda0811871aab737018c309a6b))
* **style:** add underline animation on hovered link ([0d733ac](https://github.com/tuyuritio/astro-theme-thought-lite/commit/0d733ac4472676927da63497168a9bd2034a6a9e))
* **style:** adjust font style ([a9fee39](https://github.com/tuyuritio/astro-theme-thought-lite/commit/a9fee39367d4827976a2e70ea815f7ea4e60c888))
* **style:** adjust link icon padding for better alignment ([782af88](https://github.com/tuyuritio/astro-theme-thought-lite/commit/782af88db9344293ecd3853e7389d95a96c431d2))
* **style:** adjust navigator layout ([543b2d6](https://github.com/tuyuritio/astro-theme-thought-lite/commit/543b2d681df2ede5df5b15b5649ba54581dd333c))
* **style:** avoid using `contain-layout` ([9161b47](https://github.com/tuyuritio/astro-theme-thought-lite/commit/9161b47e5ce9f8d7746d2d40a1fd5073feec7d02))
* **style:** correct font-size for code title ([5b45677](https://github.com/tuyuritio/astro-theme-thought-lite/commit/5b456779144a25e5250c84a0079ab7ab4af9f734))
* **style:** enhance footnote styling with hover effects ([b07b836](https://github.com/tuyuritio/astro-theme-thought-lite/commit/b07b836b251d56a6a77662ac9ba68a8f930ac8eb))
* **style:** enhance icon title transition effects ([1fdca4e](https://github.com/tuyuritio/astro-theme-thought-lite/commit/1fdca4ec312f92e4b514aa1c162dc8b75dbdc5bb))
* **style:** force render icon ([436cc5b](https://github.com/tuyuritio/astro-theme-thought-lite/commit/436cc5b669486c554c48627c52679d3fc35531f1))
* **style:** github alert svg lost colors ([671f45f](https://github.com/tuyuritio/astro-theme-thought-lite/commit/671f45f089571821e151b5bc40ddaf9c851eb444))
* **style:** increase z-index for medium-zoom overlay ([511860f](https://github.com/tuyuritio/astro-theme-thought-lite/commit/511860fa40fe91afb9b14cc5cba396dfa7d84e0f))
* **style:** inherit text color for mark elements to fix color errors in dark mode ([63cde8f](https://github.com/tuyuritio/astro-theme-thought-lite/commit/63cde8f0804a471d1dad42ba8d2f4b80e4fb143b))
* **style:** make hover effect responsively ([8f334d0](https://github.com/tuyuritio/astro-theme-thought-lite/commit/8f334d03bd19c1473824ec22b66ac61085633387))
* **style:** overflow in katex block ([ae3496e](https://github.com/tuyuritio/astro-theme-thought-lite/commit/ae3496e4633fe3277395ced805faf6af85a0ac70))
* **style:** reset hr style ([f19907f](https://github.com/tuyuritio/astro-theme-thought-lite/commit/f19907fd0e2daceab43c21d55330923b06ca6b7b))
* **style:** revert font style ([94445e9](https://github.com/tuyuritio/astro-theme-thought-lite/commit/94445e9b6c075151366d2fd4d50aa86006697c31))
* **style:** set figure display to inline-block ([f89b2f4](https://github.com/tuyuritio/astro-theme-thought-lite/commit/f89b2f447d744c41c2ee02173faf2269231dcd7c))
* **styles:** update colors for github alerts ([4c2716f](https://github.com/tuyuritio/astro-theme-thought-lite/commit/4c2716f9c6a651638e0eff8de859a5435f8956b5))
* **style:** update color for highlight of IMPORTANT alert ([2a26902](https://github.com/tuyuritio/astro-theme-thought-lite/commit/2a26902843f2327ec7e4866e90481868345eb5e9))
* **style:** update dark theme background ([46b7d42](https://github.com/tuyuritio/astro-theme-thought-lite/commit/46b7d4253e0952e8b039daa81c0433adc386d328))
* **style:** update jotting border color ([bffc75d](https://github.com/tuyuritio/astro-theme-thought-lite/commit/bffc75d1a8809f914c8caa87dfb6c373183ae429))
* **style:** use icon for comment timer ([886392b](https://github.com/tuyuritio/astro-theme-thought-lite/commit/886392bc19696849f9e1a266df57ea0ad72a3ea4))
* **style:** use icons for remaining items in Reply component ([03eda5a](https://github.com/tuyuritio/astro-theme-thought-lite/commit/03eda5a164e2ff6f6f044b382215ed3a4067a01a))
* **style:** wrap headings with link instead of appending ([08ab988](https://github.com/tuyuritio/astro-theme-thought-lite/commit/08ab988f3890423b9d5f22b879b12be34246e42a))
* theme transition flicker ([a1c43bd](https://github.com/tuyuritio/astro-theme-thought-lite/commit/a1c43bd5424ae10c9410b5df825bbc9a3bcf937b))
* **theme:** switch to github-light theme in shiki ([80b75c1](https://github.com/tuyuritio/astro-theme-thought-lite/commit/80b75c1439cf8b440077c5a6acdc9dc078b234a9))
* **tip:** horizontally center icon ([82d028f](https://github.com/tuyuritio/astro-theme-thought-lite/commit/82d028ffea0ad3a3cd883960d44ba61e3333e080))
* update default logo and prologue ([75588ed](https://github.com/tuyuritio/astro-theme-thought-lite/commit/75588ed6ec7ebeeca65682a967a9729175e9b5e7))
* update icon for tag and series ([4994e7c](https://github.com/tuyuritio/astro-theme-thought-lite/commit/4994e7cb86b6856defe9bdb12e389a3d660bb4e4))
* use `getEntry` to retrieve information content more efficiently ([84b272d](https://github.com/tuyuritio/astro-theme-thought-lite/commit/84b272dd47de877bbebb84465cd4beb4ab259a2f))


### Reverts

* downgrade unocss ([3c873ae](https://github.com/tuyuritio/astro-theme-thought-lite/commit/3c873aeb979072d1a5731adb83ea20bc72177857))


### Documentation

* add default language instructions ([911923d](https://github.com/tuyuritio/astro-theme-thought-lite/commit/911923df3cf086f6aedd1b3557d96d8c4f2facb3))
* add descriptions ([5a13f6e](https://github.com/tuyuritio/astro-theme-thought-lite/commit/5a13f6e01e21337b94d415d3fd6c407dc38d4a38))
* add i18n configuration documents ([d8e1f87](https://github.com/tuyuritio/astro-theme-thought-lite/commit/d8e1f879551d4d92cc4f995cf4f2cd3c4d0869b0))
* add latest content display options in configuration ([8871ccf](https://github.com/tuyuritio/astro-theme-thought-lite/commit/8871ccfc88d6a66f6ae9e6eac393dc7109c7e1e2))
* add preview images to README ([a26dddf](https://github.com/tuyuritio/astro-theme-thought-lite/commit/a26dddfbbaba9c9ffeb13494e7b08d512ddc8258))
* change date and tags ([48d3551](https://github.com/tuyuritio/astro-theme-thought-lite/commit/48d355114583d795a715ff60547bcb1bbbd8e1e6))
* **chronicle:** add feed stylesheet ([e137bae](https://github.com/tuyuritio/astro-theme-thought-lite/commit/e137baea5483b7df3beaa365001215bff75bb701))
* **chronicle:** add sensitive content warning entry ([6b183c0](https://github.com/tuyuritio/astro-theme-thought-lite/commit/6b183c073f82213989682f5f338d11f4717a5363))
* fix update command ([72bdad8](https://github.com/tuyuritio/astro-theme-thought-lite/commit/72bdad80a7c8a0ad17b73cc18aff4de2e43cece1))
* **i18n:** add feed warning for sensitive content ([e01cfc1](https://github.com/tuyuritio/astro-theme-thought-lite/commit/e01cfc1474bfb893ed97cfab86533e5bd6b4ebf0))
* **i18n:** edit translation words ([bd77d85](https://github.com/tuyuritio/astro-theme-thought-lite/commit/bd77d85b426bbd4790ab139ab494c785a5bb9063))
* **i18n:** remove claim section ([0cfc7d7](https://github.com/tuyuritio/astro-theme-thought-lite/commit/0cfc7d7e89248d0e457fe5f85da089ea6e9a24b6))
* **i18n:** remove content creation script instructions ([d96619b](https://github.com/tuyuritio/astro-theme-thought-lite/commit/d96619bda9910833a56f1a111e228fc6af9112ee))
* **i18n:** update language selection in content creation script ([3931a30](https://github.com/tuyuritio/astro-theme-thought-lite/commit/3931a3055349d2aec5cb00fe0b9ae15f4010078e))
* **information:** add monolingual feature to chronicle ([845eac3](https://github.com/tuyuritio/astro-theme-thought-lite/commit/845eac3093600bc2acf61034b9d53ab73c0b7d46))
* **information:** add new script feature to chronicle ([41c7f70](https://github.com/tuyuritio/astro-theme-thought-lite/commit/41c7f7029a640af42fe9492ab9b028b5339a01f7))
* **information:** add unauthenticated comment feature to chronicle ([dbdabb5](https://github.com/tuyuritio/astro-theme-thought-lite/commit/dbdabb564b6141d49b621b88476825f84598e4d4))
* **license:** format license as plain text ([f370402](https://github.com/tuyuritio/astro-theme-thought-lite/commit/f3704022fc93911d7bd5c93eb4d140af4b142f63))
* optimize README content ([71ecc62](https://github.com/tuyuritio/astro-theme-thought-lite/commit/71ecc62b514811322f579d321afe4588662a2f99))
* **readme:** add common commands section ([732c714](https://github.com/tuyuritio/astro-theme-thought-lite/commit/732c7144fc37e6668bd23ac88fc89b33464e3cf2))
* **readme:** add deployment buttons ([0cace54](https://github.com/tuyuritio/astro-theme-thought-lite/commit/0cace543fda420acea08840e7ee10cdec1bf3f46))
* **readme:** add format and lint commands ([dddb464](https://github.com/tuyuritio/astro-theme-thought-lite/commit/dddb464b40f0653dd7c06600b15d2305876e49ac))
* **readme:** change preview images ([4c0702c](https://github.com/tuyuritio/astro-theme-thought-lite/commit/4c0702cb46af43e21c045ec243c6d996a86daf70))
* **readme:** format feature list ([b75caa8](https://github.com/tuyuritio/astro-theme-thought-lite/commit/b75caa83f7851d3b8e254510f299664d44669e5c))
* **readme:** improve layout ([7581787](https://github.com/tuyuritio/astro-theme-thought-lite/commit/75817875d91fa603f551503354640cdabc8b6076))
* **readme:** remove ORM from tech stack ([c3d79d7](https://github.com/tuyuritio/astro-theme-thought-lite/commit/c3d79d77d406156e334f6e0f03b389d7667ceaeb))
* **readme:** update badge links ([4fe7501](https://github.com/tuyuritio/astro-theme-thought-lite/commit/4fe750168a82e4d83b0626a9781aa34d9fac462e))
* **readme:** update deployment capabilities ([5715708](https://github.com/tuyuritio/astro-theme-thought-lite/commit/5715708d6a55ddd932cd9038bac8cc91a53a27c3))
* **readme:** update i18n description ([42fde2f](https://github.com/tuyuritio/astro-theme-thought-lite/commit/42fde2f162bc6d2ea0d7d698388db68c5b15702d))
* **readme:** update i18n description ([3c107c7](https://github.com/tuyuritio/astro-theme-thought-lite/commit/3c107c7713b99b76e2d983bf68750594b6074339))
* **readme:** update live demo ([f720f10](https://github.com/tuyuritio/astro-theme-thought-lite/commit/f720f102880e370e4699ce7a208ec89a670621ae))
* **subscription:** remove language parameter description ([c1afc72](https://github.com/tuyuritio/astro-theme-thought-lite/commit/c1afc7209352ceebfc25227410b11a68823c3c68))
* update code style requirements ([a7568c0](https://github.com/tuyuritio/astro-theme-thought-lite/commit/a7568c085dd15810bcdfe56c3ba442c945ba430c))
* update contributing guidelines ([ff47f50](https://github.com/tuyuritio/astro-theme-thought-lite/commit/ff47f504c98a3c6df8e9e1b5c75fb4380f9638f8))
* update contribution guidelines for formatting ([baed903](https://github.com/tuyuritio/astro-theme-thought-lite/commit/baed9035743d29a90e9206a17e8fae2b5baa3e90))
* update README ([4459c43](https://github.com/tuyuritio/astro-theme-thought-lite/commit/4459c43dcde4d656e20fbedf6653473a0a65246d))
* update README and add contributing guide ([0b8fe92](https://github.com/tuyuritio/astro-theme-thought-lite/commit/0b8fe92e74d1df19ace9a70fcbf50e0608f05803))
* update tech stack ([404ee2d](https://github.com/tuyuritio/astro-theme-thought-lite/commit/404ee2d326524cb74b1a1d87b06e88871f53f1b7))


### Miscellaneous Chores

* add biome as formatter and linter ([a413d8a](https://github.com/tuyuritio/astro-theme-thought-lite/commit/a413d8a5e2b042fb490794e4b8fa598c2350acca))
* add code quality workflow ([4ae73b7](https://github.com/tuyuritio/astro-theme-thought-lite/commit/4ae73b71bb409b935d8dd3bff07c101df9e37d6e))
* add format and lint scripts ([8a58acb](https://github.com/tuyuritio/astro-theme-thought-lite/commit/8a58acb256e5a05a59f66911aae9478ce1fdd1c2))
* add pre-commit hook ([0526018](https://github.com/tuyuritio/astro-theme-thought-lite/commit/0526018580f94d6c5b92a34842ca994ca72494b3))
* add release workflow configuration ([ad2ab55](https://github.com/tuyuritio/astro-theme-thought-lite/commit/ad2ab5550495aa0eacea0e39e931d609d68a68ba))
* add release-please configuration ([1cca393](https://github.com/tuyuritio/astro-theme-thought-lite/commit/1cca39356f4d87013de9ee80b00b0ad7014688aa))
* **config:** apply config schema file to project level ([9fad142](https://github.com/tuyuritio/astro-theme-thought-lite/commit/9fad1426aadc12f59c63a67509ee238dbc7e7740))
* enforce additionalProperties in schema ([ac966ce](https://github.com/tuyuritio/astro-theme-thought-lite/commit/ac966ce19eace2186f66b8d2b154d28b11a6cb6f))
* **i18n:** render language switcher dynamically ([4863d8a](https://github.com/tuyuritio/astro-theme-thought-lite/commit/4863d8ade46fbe02b82efca2f4ade1def45d942e))
* ignore formatting for npm files ([f350c7d](https://github.com/tuyuritio/astro-theme-thought-lite/commit/f350c7d3eda7a942496f02f06ae66a590a54f416))
* **main:** release 0.15.5 ([#2](https://github.com/tuyuritio/astro-theme-thought-lite/issues/2)) ([c7b1b1c](https://github.com/tuyuritio/astro-theme-thought-lite/commit/c7b1b1c54af25412774d9a018c02a1d97dfdc505))
* **main:** release 0.15.6 ([#3](https://github.com/tuyuritio/astro-theme-thought-lite/issues/3)) ([fb5cc7c](https://github.com/tuyuritio/astro-theme-thought-lite/commit/fb5cc7cbef0fa1f6c91f554c9516511e065f66f0))
* **main:** release 0.15.7 ([#4](https://github.com/tuyuritio/astro-theme-thought-lite/issues/4)) ([9b1e98d](https://github.com/tuyuritio/astro-theme-thought-lite/commit/9b1e98d9bd910d382093a5f9c44d4e49cb1df0b7))
* **main:** release 0.16.0 ([#5](https://github.com/tuyuritio/astro-theme-thought-lite/issues/5)) ([7301eb3](https://github.com/tuyuritio/astro-theme-thought-lite/commit/7301eb3999831b22a52766a31ee031d6f845aac4))
* **main:** release 0.17.0 ([#6](https://github.com/tuyuritio/astro-theme-thought-lite/issues/6)) ([222a03f](https://github.com/tuyuritio/astro-theme-thought-lite/commit/222a03f95d699d971a2e11bc5ec08f25ded27a18))
* **main:** release 0.17.1 ([#8](https://github.com/tuyuritio/astro-theme-thought-lite/issues/8)) ([e3b44f7](https://github.com/tuyuritio/astro-theme-thought-lite/commit/e3b44f7b280ebf9cb8fd9e25e323d64e706a0159))
* **main:** release 0.17.2 ([#9](https://github.com/tuyuritio/astro-theme-thought-lite/issues/9)) ([d02d868](https://github.com/tuyuritio/astro-theme-thought-lite/commit/d02d868c85d1cca90ef845c874a39f50792c7e51))
* **main:** release 0.17.3 ([#10](https://github.com/tuyuritio/astro-theme-thought-lite/issues/10)) ([edf6dbd](https://github.com/tuyuritio/astro-theme-thought-lite/commit/edf6dbd590456464a64709e3b0196a52fe586d0c))
* **main:** release 0.18.0 ([#12](https://github.com/tuyuritio/astro-theme-thought-lite/issues/12)) ([2016776](https://github.com/tuyuritio/astro-theme-thought-lite/commit/201677632b44b1ac9c75fa47217d38522cadc8d0))
* **main:** release 0.19.0 ([#13](https://github.com/tuyuritio/astro-theme-thought-lite/issues/13)) ([b1ec3fd](https://github.com/tuyuritio/astro-theme-thought-lite/commit/b1ec3fd0f97fd4ef078c78bb9b2749c0a0d1e2e3))
* **main:** release 0.19.1 ([#14](https://github.com/tuyuritio/astro-theme-thought-lite/issues/14)) ([7f3926f](https://github.com/tuyuritio/astro-theme-thought-lite/commit/7f3926fbed31910f5e157a04396a231537723680))
* **main:** release 0.19.2 ([#15](https://github.com/tuyuritio/astro-theme-thought-lite/issues/15)) ([19374d8](https://github.com/tuyuritio/astro-theme-thought-lite/commit/19374d8d2b32f5fd1b80862b18e4cb2ad82fbd2a))
* **main:** release 0.19.3 ([#16](https://github.com/tuyuritio/astro-theme-thought-lite/issues/16)) ([1e2cca7](https://github.com/tuyuritio/astro-theme-thought-lite/commit/1e2cca7f5fac0dc28053086d31dca039c53321d2))
* **main:** release 0.19.4 ([#18](https://github.com/tuyuritio/astro-theme-thought-lite/issues/18)) ([91e366a](https://github.com/tuyuritio/astro-theme-thought-lite/commit/91e366a4777ef5d0ab5ed68d4458eb9da53b1a22))
* **main:** release 0.19.5 ([#19](https://github.com/tuyuritio/astro-theme-thought-lite/issues/19)) ([14c2b15](https://github.com/tuyuritio/astro-theme-thought-lite/commit/14c2b15b777a2a454a06ce4d0579a4e9c2d755af))
* **main:** release 0.19.6 ([#21](https://github.com/tuyuritio/astro-theme-thought-lite/issues/21)) ([fdcb6fd](https://github.com/tuyuritio/astro-theme-thought-lite/commit/fdcb6fd256101adaacfc94240a0f0d4896ca510c))
* **main:** release 0.20.0 ([#22](https://github.com/tuyuritio/astro-theme-thought-lite/issues/22)) ([35ec33c](https://github.com/tuyuritio/astro-theme-thought-lite/commit/35ec33c2aee3392cd056dc8786e1d93c9c614b2b))
* **main:** release 0.21.0 ([#24](https://github.com/tuyuritio/astro-theme-thought-lite/issues/24)) ([309f2da](https://github.com/tuyuritio/astro-theme-thought-lite/commit/309f2dac5ce793b59ae04a1788c6ad6612606831))
* **main:** release 0.21.1 ([#25](https://github.com/tuyuritio/astro-theme-thought-lite/issues/25)) ([9f0e3f8](https://github.com/tuyuritio/astro-theme-thought-lite/commit/9f0e3f8e36b883e9f297e7fbf044822ddcd6838e))
* **main:** release 0.21.2 ([#26](https://github.com/tuyuritio/astro-theme-thought-lite/issues/26)) ([fa33e98](https://github.com/tuyuritio/astro-theme-thought-lite/commit/fa33e98e93505cab5a2ed4f8410b4dca89bffa36))
* **main:** release 0.21.3 ([#27](https://github.com/tuyuritio/astro-theme-thought-lite/issues/27)) ([ca2bac8](https://github.com/tuyuritio/astro-theme-thought-lite/commit/ca2bac89e377a8987a3b4a5ac665f8b2c1c03659))
* **main:** release 0.21.4 ([#28](https://github.com/tuyuritio/astro-theme-thought-lite/issues/28)) ([0d41643](https://github.com/tuyuritio/astro-theme-thought-lite/commit/0d416434a8f27637d71fe0ad9fe5f8b1523af030))
* **main:** release 0.21.5 ([#29](https://github.com/tuyuritio/astro-theme-thought-lite/issues/29)) ([256eef5](https://github.com/tuyuritio/astro-theme-thought-lite/commit/256eef5b88b9519c04c9250493154ea254e13eba))
* **main:** release 0.21.6 ([#30](https://github.com/tuyuritio/astro-theme-thought-lite/issues/30)) ([d14b7f2](https://github.com/tuyuritio/astro-theme-thought-lite/commit/d14b7f265256a2a6894955776f76453c39a9dbfe))
* **main:** release 0.22.0 ([#31](https://github.com/tuyuritio/astro-theme-thought-lite/issues/31)) ([51ebf16](https://github.com/tuyuritio/astro-theme-thought-lite/commit/51ebf16f8de6acb03b7b53c294dd61b534d7706b))
* **main:** release 0.22.1 ([#32](https://github.com/tuyuritio/astro-theme-thought-lite/issues/32)) ([8f50023](https://github.com/tuyuritio/astro-theme-thought-lite/commit/8f500233ee5ce7ad3a520f4a6dabb9e23f6bcf32))
* **main:** release 0.22.2 ([#33](https://github.com/tuyuritio/astro-theme-thought-lite/issues/33)) ([5b1e70b](https://github.com/tuyuritio/astro-theme-thought-lite/commit/5b1e70b506cc0646f9ba947c78f0d38186dafa50))
* **main:** release 0.22.3 ([#35](https://github.com/tuyuritio/astro-theme-thought-lite/issues/35)) ([756f099](https://github.com/tuyuritio/astro-theme-thought-lite/commit/756f099298160b48baac20efed7d73426a4dd139))
* migrate from npm to pnpm ([a99b8d6](https://github.com/tuyuritio/astro-theme-thought-lite/commit/a99b8d642fbc1a614819277f64115b9b55ee94ca))
* move some components to layouts ([0b445e3](https://github.com/tuyuritio/astro-theme-thought-lite/commit/0b445e3c74174e54e224ae8ba3df3e267a3f972c))
* remove comment system ([df5d6de](https://github.com/tuyuritio/astro-theme-thought-lite/commit/df5d6de92d6c5ea3155cf116d484fade03358923))
* update ignore rule for todo files ([1865889](https://github.com/tuyuritio/astro-theme-thought-lite/commit/186588934b780f1248642ee498785d5745998f1b))
* update release type ([ed66716](https://github.com/tuyuritio/astro-theme-thought-lite/commit/ed66716aa1d595b78771d6a1507cd9f3343e7e4b))


### Code Refactoring

* **note:** rename frontmatter `contents` field to `toc` ([6a3673a](https://github.com/tuyuritio/astro-theme-thought-lite/commit/6a3673a2202dab4f7f545516806b0a4f734a1f5a))

## [0.22.3](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.22.2...v0.22.3) (2025-11-11)


### Bug Fixes

* **i18n:** remove fallback to default locale ([83f2320](https://github.com/tuyuritio/astro-theme-thought-lite/commit/83f23201ce5720054d9d366414eacefe7a5fac67))
* implement dynamic navigation routes ([21d1941](https://github.com/tuyuritio/astro-theme-thought-lite/commit/21d1941c993a4a4d4cd354f67463cb6e244ad7ba))
* remove web app manifest ([ab6ddc8](https://github.com/tuyuritio/astro-theme-thought-lite/commit/ab6ddc83327eed36a357466ba4b8654f7f5c2e9a))

## [0.22.2](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.22.1...v0.22.2) (2025-11-09)


### Bug Fixes

* replace rehype-figure plugin with custom implementation ([8a94eb7](https://github.com/tuyuritio/astro-theme-thought-lite/commit/8a94eb7cf69575d29026201446d87c1115094806))

## [0.22.1](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.22.0...v0.22.1) (2025-11-09)


### Bug Fixes

* **i18n:** update validation messages for content ID ([28a355d](https://github.com/tuyuritio/astro-theme-thought-lite/commit/28a355d0155a1620ae57ef9c16fbfcf04e059d65))

## [0.22.0](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.21.6...v0.22.0) (2025-11-07)


### Features

* **config:** migrate site configuration to TypeScript ([183c99e](https://github.com/tuyuritio/astro-theme-thought-lite/commit/183c99e6eb04177002d04916271b7b626987dfcf))
* **i18n:** implement multilingual support for content creation script ([64acaf4](https://github.com/tuyuritio/astro-theme-thought-lite/commit/64acaf4745200d3e00b0c7f4dc86b22b56d14004))


### Bug Fixes

* **config:** simplify author structure ([73ca403](https://github.com/tuyuritio/astro-theme-thought-lite/commit/73ca4037982c639a6b8bf81eb7a79f091464e020))
* **i18n:** remove astro-locales integration and replace imports ([e565f8a](https://github.com/tuyuritio/astro-theme-thought-lite/commit/e565f8a0c2b14f49009f8185686c7579255d2432))

## [0.21.6](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.21.5...v0.21.6) (2025-11-06)


### Bug Fixes

* **config:** correct uniqueItems placement ([17ee92b](https://github.com/tuyuritio/astro-theme-thought-lite/commit/17ee92bcd1649853e519886a4c864719d20f1890))
* filtered URL not applied correctly ([affd1ff](https://github.com/tuyuritio/astro-theme-thought-lite/commit/affd1ff6d5884444ac194d7028a242bd2fb830e6))

## [0.21.5](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.21.4...v0.21.5) (2025-11-06)


### Bug Fixes

* **i18n:** adapt creation script for monolingual mode ([b1e63e0](https://github.com/tuyuritio/astro-theme-thought-lite/commit/b1e63e0537f5767b9c1272e22e3bc2318064a9f2))

## [0.21.4](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.21.3...v0.21.4) (2025-11-06)


### Bug Fixes

* content inclusion condition ([c582139](https://github.com/tuyuritio/astro-theme-thought-lite/commit/c5821396665672d161235ad9470c3d4b09b56b2f))

## [0.21.3](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.21.2...v0.21.3) (2025-11-06)


### Bug Fixes

* add workaround for dependency optimization ([b574724](https://github.com/tuyuritio/astro-theme-thought-lite/commit/b57472477b23bc5bfc0e4dbb6fd775a897991ae7))
* **config:** update `latest` configuration ([ac1f90b](https://github.com/tuyuritio/astro-theme-thought-lite/commit/ac1f90b49394a57d792ce8c9aebb1ff6a9f7eb75))
* **feed:** improve locale handling ([46ca019](https://github.com/tuyuritio/astro-theme-thought-lite/commit/46ca0193232402b348778d9e84a2ef6368ccf5e8))

## [0.21.2](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.21.1...v0.21.2) (2025-11-06)


### Bug Fixes

* enhance URL building ([d1e9422](https://github.com/tuyuritio/astro-theme-thought-lite/commit/d1e9422d9b56be31f7f891e8d5fd942ae4bad3b9))
* **i18n:** add multilocale constant ([ca28acf](https://github.com/tuyuritio/astro-theme-thought-lite/commit/ca28acfbd47635c0e853cf220cf963911d613828))

## [0.21.1](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.21.0...v0.21.1) (2025-11-05)


### Bug Fixes

* correct collection name ([b75a25a](https://github.com/tuyuritio/astro-theme-thought-lite/commit/b75a25ae3c93523a23817c33f141e23963c5c3d7))

## [0.21.0](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.20.0...v0.21.0) (2025-11-05)


### Features

* enable manual triggering of release workflow ([f3dcbbe](https://github.com/tuyuritio/astro-theme-thought-lite/commit/f3dcbbe8f808904c579d031c53c9df1d8548264c))
* **i18n:** add monolocale integration ([277abe6](https://github.com/tuyuritio/astro-theme-thought-lite/commit/277abe67b2e61ab2fb93402ca0c1356a93efeb7f))
* **i18n:** implement monolocale support ([f703a40](https://github.com/tuyuritio/astro-theme-thought-lite/commit/f703a4083bd705e69a7784cba35b0d42aa10a029))

## [0.20.0](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.19.6...v0.20.0) (2025-11-04)


### Features

* add latest content config and empty state messages ([1914d7e](https://github.com/tuyuritio/astro-theme-thought-lite/commit/1914d7e3c4efa085d8c988ec499948944b18cb17))
* optionally show newest jotting and note on homepage ([1867264](https://github.com/tuyuritio/astro-theme-thought-lite/commit/1867264e43db1dd77520cc6949fafe4abe58001a))


### Bug Fixes

* **config:** change latest content display configuration ([fabb973](https://github.com/tuyuritio/astro-theme-thought-lite/commit/fabb973743622f99a01cc96e2e44f0fa23d407cf))
* improve empty state handling ([eea4fc9](https://github.com/tuyuritio/astro-theme-thought-lite/commit/eea4fc9a0dea80d4f1683a0c125c28e5dfb56641))
* refactor latest content retrieval and fix type error ([e6aa8b6](https://github.com/tuyuritio/astro-theme-thought-lite/commit/e6aa8b61f9c3a14e499609ba23f5ead645f75c7e))
* rename and minor fixes ([6e6b4cf](https://github.com/tuyuritio/astro-theme-thought-lite/commit/6e6b4cffd52de8d208273ddd130c63df2091b734))
* show a message when note or jotting is empty ([8c9736b](https://github.com/tuyuritio/astro-theme-thought-lite/commit/8c9736ba9c3ec84e4640ff8eba53bb806c3d014d))

## [0.19.6](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.19.5...v0.19.6) (2025-11-03)


### Bug Fixes

* render `<time>` tooltip according to client language and timezone ([3a43906](https://github.com/tuyuritio/astro-theme-thought-lite/commit/3a43906700b698ff3d1729b29ece979f4899cce8))
* **style:** adjust link icon padding for better alignment ([782af88](https://github.com/tuyuritio/astro-theme-thought-lite/commit/782af88db9344293ecd3853e7389d95a96c431d2))

## [0.19.5](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.19.4...v0.19.5) (2025-11-02)


### Bug Fixes

* **style:** enhance footnote styling with hover effects ([b07b836](https://github.com/tuyuritio/astro-theme-thought-lite/commit/b07b836b251d56a6a77662ac9ba68a8f930ac8eb))
* **style:** inherit text color for mark elements to fix color errors in dark mode ([63cde8f](https://github.com/tuyuritio/astro-theme-thought-lite/commit/63cde8f0804a471d1dad42ba8d2f4b80e4fb143b))

## [0.19.4](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.19.3...v0.19.4) (2025-11-01)


### Bug Fixes

* **feed:** adopt Astro container (experimental) for rendering markdown images ([874db37](https://github.com/tuyuritio/astro-theme-thought-lite/commit/874db3741c0c4b872638ffd3ee8eaadec29ec779))

## [0.19.3](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.19.2...v0.19.3) (2025-10-27)


### Bug Fixes

* no longer specify specific icons due to global staticization ([ccfd2c5](https://github.com/tuyuritio/astro-theme-thought-lite/commit/ccfd2c580344f3f925351cf512b458fc152e5898))
* remove unused import of `getCollection` ([4c9c059](https://github.com/tuyuritio/astro-theme-thought-lite/commit/4c9c059247f0a2891a561f57bef50de53d6b11a8))

## [0.19.2](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.19.1...v0.19.2) (2025-10-26)


### Bug Fixes

* use `getEntry` to retrieve information content more efficiently ([84b272d](https://github.com/tuyuritio/astro-theme-thought-lite/commit/84b272dd47de877bbebb84465cd4beb4ab259a2f))

## [0.19.1](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.19.0...v0.19.1) (2025-10-19)


### Bug Fixes

* add aria-label to Icon ([9d484e4](https://github.com/tuyuritio/astro-theme-thought-lite/commit/9d484e4a50c6cb44f3b83e5d6bb0c6e4b8cfc26f))
* **style:** update dark theme background ([46b7d42](https://github.com/tuyuritio/astro-theme-thought-lite/commit/46b7d4253e0952e8b039daa81c0433adc386d328))
* **style:** update jotting border color ([bffc75d](https://github.com/tuyuritio/astro-theme-thought-lite/commit/bffc75d1a8809f914c8caa87dfb6c373183ae429))

## [0.19.0](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.18.0...v0.19.0) (2025-10-17)


### Features

* add interactive CLI script for creating new content ([dadd562](https://github.com/tuyuritio/astro-theme-thought-lite/commit/dadd562ca76001e898323a39de03d1f76f3a74cf))


### Bug Fixes

* **jotting:** adjust border thickness ([25ffb7e](https://github.com/tuyuritio/astro-theme-thought-lite/commit/25ffb7edd21a80349d0791a7ff68da978087decb))

## [0.18.0](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.17.3...v1.0.0) (2025-10-13)


### ⚠ BREAKING CHANGES

* **note:** `contents` is no longer supported in frontmatter, use `toc` instead.

### Code Refactoring

* **note:** rename frontmatter `contents` field to `toc` ([6a3673a](https://github.com/tuyuritio/astro-theme-thought-lite/commit/6a3673a2202dab4f7f545516806b0a4f734a1f5a))

## [0.17.3](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.17.2...v0.17.3) (2025-10-08)


### Bug Fixes

* **style:** revert font style ([94445e9](https://github.com/tuyuritio/astro-theme-thought-lite/commit/94445e9b6c075151366d2fd4d50aa86006697c31))

## [0.17.2](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.17.1...v0.17.2) (2025-10-08)


### Bug Fixes

* **style:** adjust font style ([a9fee39](https://github.com/tuyuritio/astro-theme-thought-lite/commit/a9fee39367d4827976a2e70ea815f7ea4e60c888))
* **style:** wrap headings with link instead of appending ([08ab988](https://github.com/tuyuritio/astro-theme-thought-lite/commit/08ab988f3890423b9d5f22b879b12be34246e42a))

## [0.17.1](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.17.0...v0.17.1) (2025-10-06)


### Bug Fixes

* add missing paginator styles ([249d39b](https://github.com/tuyuritio/astro-theme-thought-lite/commit/249d39b0fadedd7f56fcd9ddb0cef191cc201b27))
* set initial values for list rendering ([6300997](https://github.com/tuyuritio/astro-theme-thought-lite/commit/630099735ec515347916d050b6424086dafd738c))
* **style:** make hover effect responsively ([8f334d0](https://github.com/tuyuritio/astro-theme-thought-lite/commit/8f334d03bd19c1473824ec22b66ac61085633387))

## [0.17.0](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.16.0...v0.17.0) (2025-10-05)


### Features

* add total word count in footer ([9b3ca20](https://github.com/tuyuritio/astro-theme-thought-lite/commit/9b3ca20436222cd80aed49f1d7fb83e06718be7d))


### Bug Fixes

* **style:** add hover effect for items in jotting and note list ([e2fbc48](https://github.com/tuyuritio/astro-theme-thought-lite/commit/e2fbc48dc4f701fda0811871aab737018c309a6b))

## [0.16.0](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.15.7...v0.16.0) (2025-10-04)


### Features

* replace SSR with CSR for list filtering ([3d374c8](https://github.com/tuyuritio/astro-theme-thought-lite/commit/3d374c89617a98caf609fe5d11a86b231925d8be))
* staticize error pages ([778bd9e](https://github.com/tuyuritio/astro-theme-thought-lite/commit/778bd9e194d7afb58bb6db212a4e07f80e8481f3))

## [0.15.7](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.15.6...v0.15.7) (2025-10-02)


### Bug Fixes

* **style:** avoid using `contain-layout` ([9161b47](https://github.com/tuyuritio/astro-theme-thought-lite/commit/9161b47e5ce9f8d7746d2d40a1fd5073feec7d02))
* **style:** update color for highlight of IMPORTANT alert ([2a26902](https://github.com/tuyuritio/astro-theme-thought-lite/commit/2a26902843f2327ec7e4866e90481868345eb5e9))

## [0.15.6](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.15.5...v0.15.6) (2025-09-29)


### Bug Fixes

* update default logo and prologue ([75588ed](https://github.com/tuyuritio/astro-theme-thought-lite/commit/75588ed6ec7ebeeca65682a967a9729175e9b5e7))

## [0.15.5](https://github.com/tuyuritio/astro-theme-thought-lite/compare/v0.15.4...v0.15.5) (2025-09-28)


### Bug Fixes

* correct SPA loading issue on policy page ([14ab7ea](https://github.com/tuyuritio/astro-theme-thought-lite/commit/14ab7ea82da36c8b9f3994e2b57d102df32c15d8))

# Avoiding TypeScript Compilation Errors

## Ignoring JavaScript Files in Git
To prevent committing `.js` files generated from TypeScript compilation, add the following to your `.gitignore`:

```
*.js
```

### Ignore JavaScript Files in Specific Folders
```
main/*.js
```
### Use `import * as` for Default Exports in CommonJS
If a package does not support default imports, use:
```ts
import * as somePackage from "some-package";
```
### CONNECTION ACKNOWLEDGEMENT (MQTT Packets) 
contributers working on packet deserialization consider Enum response file(Enums.ts) on arun-broker-function branch and also check for updates in server.ts file


##### Note: New libraries should not be used without approval, and the above method of import should only be used if the library supports for core functions. If needed, bring it up in the team discussion to further evaluate

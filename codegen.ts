import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'database/schema.graphql',
  documents: ['./src/app/operations.graphql'],
  generates: {
    './src/app/api.generated.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-apollo-angular'],
      config: {
        addExplicitOverride: true,
        defaultScalarType: "unknown",
        scalars: { "Date": "Date", "Long": "number" }
      }
    }
  }
}

export default config

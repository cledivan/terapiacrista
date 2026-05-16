param name string
param location string
param tags object = {}

resource staticWebApp 'Microsoft.Web/staticSites@2022-03-01' = {
  name: name
  location: location
  tags: union(tags, { 'azd-service-name': 'web' })
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: ''
    branch: ''
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
  }
}

output name string = staticWebApp.name
output uri string = 'https://${staticWebApp.properties.defaultHostname}'

targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the environment which is used to generate a short unique hash used in all resources.')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string

var abbreviations = loadJsonContent('./abbreviations.json')
var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))
var tags = { 'azd-env-name': environmentName }

resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: '${abbreviations.resourceGroup}${environmentName}'
  location: location
  tags: tags
}

module staticWebApp './staticwebapp.bicep' = {
  name: 'staticwebapp'
  scope: rg
  params: {
    name: '${abbreviations.staticWebApps}${resourceToken}'
    location: location
    tags: tags
  }
}

output AZURE_LOCATION string = location
output AZURE_TENANT_ID string = tenant().tenantId

interface IContactInfo {
  name: string
  email: string
}

interface IErrorDetails {
  errorText: string
  errorCode: string
  errorRef: string
  errorTS: string
}

interface IService {
  serviceName: string
  status: 'ok' | 'error'
  AWSAccount: string
  contactInfo: IContactInfo
  team: string
  errorDetails: IErrorDetails[]
  lastErrorTS: string
}

export default IService

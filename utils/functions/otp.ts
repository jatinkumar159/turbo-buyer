import * as Yup from 'yup'

export function getFormDefaultsForOTP(digits: number): {
  inputs: string[]
  initialValues: any
  validation: any
} {
  const inputs: string[] = []
  const initialValues: any = {}
  const validation: any = {}

  for (let digit = 1; digit <= digits; digit++) {
    inputs.push(`digit${digit}`)
    initialValues[`digit${digit}`] = ''
    validation[`digit${digit}`] = Yup.string().length(1).required()
  }

  return { inputs, initialValues, validation }
}

import { IServiceParams, UploaderEnvs, UploaderInputs } from '../types'

import { parseSlugFromRemoteAddr } from '../helpers/git'

export function detect(envs: UploaderEnvs): boolean {
  return Boolean(envs.GITLAB_CI)
}

function _getBuild(inputs: UploaderInputs): string {
  const { args, envs } = inputs
  return args.build || envs.CI_BUILD_ID?.toString() || envs.CI_JOB_ID?.toString() || ''
}

// eslint-disable-next-line no-unused-vars
function _getBuildURL(inputs: UploaderInputs): string {
  return ''
}

function _getBranch(inputs: UploaderInputs): string {
  const { args, envs } = inputs
  return args.branch || envs.CI_BUILD_REF_NAME?.toString() || envs.CI_COMMIT_REF_NAME?.toString() || ''
}

// eslint-disable-next-line no-unused-vars
function _getJob(envs: UploaderEnvs): string {
  return ''
}

function _getPR(inputs: UploaderInputs): string {
  const { args } = inputs
  return args.pr || ''
}

function _getService(): string {
  return 'gitlab'
}

export function getServiceName(): string {
  return 'GitLab CI'
}

function _getSHA(inputs: UploaderInputs): string {
  const { args, envs } = inputs
  return args.sha || envs.CI_BUILD_REF?.toString() || envs.CI_COMMIT_SHA?.toString() || ''
}

function _getSlug(inputs: UploaderInputs): string {
  const { args, envs } = inputs
  const remoteAddr = envs.CI_BUILD_REPO?.toString() || envs.CI_REPOSITORY_URL?.toString() || ''
  return (
    args.slug ||
    envs.CI_PROJECT_PATH?.toString() ||
    parseSlugFromRemoteAddr(remoteAddr) ||
    ''
  )
}

export function getServiceParams(inputs: UploaderInputs): IServiceParams {
  return {
    branch: _getBranch(inputs),
    build: _getBuild(inputs),
    buildURL: _getBuildURL(inputs),
    commit: _getSHA(inputs),
    job: _getJob(inputs.envs),
    pr: _getPR(inputs),
    service: _getService(),
    slug: _getSlug(inputs),
  }
}

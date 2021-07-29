import { logAndThrow } from '../helpers/util'
import { UploaderInputs, IServiceParams, UploaderEnvs } from '../types'

/**
 * Detects if this CI provider is being used
 *
 * @param {*} envs an object of enviromental variable key/value pairs
 * @returns boolean
 */
export function detect(envs: UploaderEnvs): boolean {
  return !!envs.BUILDKITE
}

/**
 * Determine the build number, based on args and envs
 *
 * @param {args: {}, envs: {}} inputs an object of arguments and enviromental variable key/value pairs
 * @returns {string}
 */
function _getBuild(inputs: UploaderInputs): string {
  const { args, envs } = inputs
  return args.build || envs.BUILDKITE_BUILD_NUMBER ?.toString()|| ''
}

/**
 * Determine the build URL for use in the Codecov UI
 *
 * @param {args: {}, envs: {}} inputs an object of arguments and enviromental variable key/value pairs
 * @returns {string}
 */
// eslint-disable-next-line no-unused-vars
function _getBuildURL(inputs: UploaderInputs): string {
  return inputs.envs.BUILDKITE_BUILD_URL?.toString() || ''
}

/**
 * Determine the branch of the repository, based on args and envs
 *
 * @param {args: {}, envs: {}} inputs an object of arguments and enviromental variable key/value pairs
 * @returns {string}
 */
function _getBranch(inputs: UploaderInputs): string {
  const { args, envs } = inputs
  return args.branch || envs.BUILDKITE_BRANCH?.toString() || ''
}

/**
 * Determine the job number, based on args or envs
 *
 * @param {*} envs an object of enviromental variable key/value pairs
 * @returns {string}
 */
function _getJob(envs: UploaderEnvs): string {
  return envs.BUILDKITE_JOB_ID?.toString() || ''
}

/**
 * Determine the PR number, based on args and envs
 *
 * @param {args: {}, envs: {}} inputs an object of arguments and enviromental variable key/value pairs
 * @returns {string}
 */
function _getPR(inputs: UploaderInputs): string {
  const { args } = inputs
  return args.pr || ''
}

/**
 * The CI service name that gets sent to the Codecov uploader as part of the query string
 *
 * @returns {string}
 */
export function _getService(): string {
  return 'buildkite'
}

/**
 * The CI Service name that gets displayed when running the uploader
 *
 * @returns
 */
export function getServiceName(): string {
  return 'Buildkite'
}
/**
 * Determine the commit SHA that is being uploaded, based on args or envs
 *
 * @param {args: {}, envs: {}} inputs an object of arguments and enviromental variable key/value pairs
 * @returns {string}
 */
function _getSHA(inputs: UploaderInputs): string {
  const { args, envs } = inputs
  if (!!args.sha || !!envs.BUILDKITE_COMMIT) {
    return args.sha || envs.BUILDKITE_COMMIT?.toString() || ''
  }
  logAndThrow('Unable to detect sha, please set manually with the -C flag')
  return ''
}
/**
 * Determine the slug (org/repo) based on  args or envs
 *
 * @param {args: {}, envs: {}} inputs an object of arguments and enviromental variable key/value pairs
 * @returns {string}
 */
function _getSlug(inputs: UploaderInputs): string {
  const { args, envs } = inputs
  if (args.slug || envs.BUILDKITE_PROJECT_SLUG) {
    return args.slug || envs.BUILDKITE_PROJECT_SLUG?.toString() || ''
  }
  logAndThrow('Unable to detect sluh, please set manually with the -r flag')
  return ''
}
/**
 * Generates and return the serviceParams object
 *
 * @param {args: {}, envs: {}} inputs an object of arguments and enviromental variable key/value pairs
 * @returns {{ branch: string, build: string, buildURL: string, commit: string, job: string, pr: string, service: string, slug: string }}
 */
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

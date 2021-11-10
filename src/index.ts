import type { GitCommit, FileModification } from "./types/git_commit_type";
import { validatePath, resolveHome } from "./util";
import checkoutCommit from "./checkout_commit";
import gitPull from "./git_pull";
import gitDiff from "./git_diff";
import parseGitLog from "./parse_git_log";
import gitLogStream from "./git_log_stream";

type gitToJsOptions = {
  sinceCommit?: string;
};

const gitToJs = (
  repoPath: string,
  // @ts-expect-error ts-migrate(1015) FIXME: Parameter cannot have question mark and initialize... Remove this comment to see the full error message
  options?: gitToJsOptions = {}
): Promise<GitCommit[]> => {
  const resolvedPath = resolveHome(repoPath);

  try {
    validatePath(resolvedPath);
  } catch (e) {
    return Promise.reject(e);
  }

  const { stream, addErrorHandler } = gitLogStream(resolvedPath, options);

  return new Promise((resolve, reject) => {
    addErrorHandler(reject);

    parseGitLog(stream).then(resolve);
  });
};

export { gitToJs, checkoutCommit, gitPull, gitDiff };
export type { GitCommit, FileModification };

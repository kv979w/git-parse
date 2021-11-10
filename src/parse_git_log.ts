import type { GitCommit } from "./types/git_commit_type";
import { gitLogCommitMarker } from "./constants/git_log_format_markers";
import parseCommit from "./parse_commit";
import byline from "byline";

const parseGitLog = (stream: any): Promise<GitCommit[]> => {
  return new Promise((resolve, reject) => {
    let buffer = [];
    const parsedCommits = [];
    const streamByLine = byline(stream);
    const commitPattern = gitLogCommitMarker;

    streamByLine.on("data", (line) => {
      const lineString = line.toString();
      if (lineString.match(commitPattern)) {
        if (buffer.length) {
          // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'GitCommit' is not assignable to ... Remove this comment to see the full error message
          parsedCommits.push(parseCommit(buffer));
          buffer = [];
        }
      } else {
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
        buffer.push(lineString);
      }
    });

    streamByLine.on("error", (e) => {
      reject(e);
    });

    streamByLine.on("end", () => {
      if (buffer.length) {
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'GitCommit' is not assignable to ... Remove this comment to see the full error message
        parsedCommits.push(parseCommit(buffer));
      }
      resolve(parsedCommits);
    });
  });
};

export default parseGitLog;

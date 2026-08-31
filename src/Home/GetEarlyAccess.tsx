import { Centering } from "../components/Centering";
import type { PropsWithClassName } from "../types";

export function GetEarlyAccess(props: PropsWithClassName) {
  return (
    <Centering className={props.className}>
      <section>
        <h1>Get Early Access</h1>
        <p>
          Sign up to receive product launch updates, beta testing opportunities,
          and invitations to user interviews.
        </p>
      </section>
    </Centering>
  );
}

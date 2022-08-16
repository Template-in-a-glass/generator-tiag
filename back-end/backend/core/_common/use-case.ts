export interface UseCase<R, P, E, I> {
  (request: R, presenter: Presenter<P, E>, inject: I): Promise<void>;
}

export interface Presenter<P, E> {
  presentSuccess(reponse: P): void;
  presentFail(error: E): void;
}

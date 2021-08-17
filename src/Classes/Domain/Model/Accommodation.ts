export class Accommodation {
  constructor(
  private readonly provider: string,
  public readonly originalId: string,
  public readonly name: string,
  public readonly description: string,
  public readonly price: number,
  public readonly image: string,
  public readonly remoteness: number,
  public readonly bookedDates: number[]
  ) {}

  public getId () : string {
    return this.provider + '-' + this.originalId
  }
  public isProvidedBy(providerName: string): boolean {
    return this.provider === providerName
  }
}

import { RawMessage, RawText } from "@minecraft/server";

export class RawtextBuilder {
	private rawstr: RawMessage[] = [];
	public constructor () {}
	/**
	 * @description Add a string to the rawtext
	 */
	public addText (string: string) {
		this.rawstr.push({
			text: string,
		});
		return this;
	}
	/**
	 * @description Add a translation-with to the rawtext
	 */
	public addTranslate (key: string, ...args: string[]) {
		this.rawstr.push({
			translate: key,
			with: args,
		});
		return this;
	}
	/**
	 * @description Skip a line
	 */
	public endl () {
		this.rawstr.push({
			text: "\n",
		});
		return this;
	}
	/**
	 * @description Parse the rawMessage to rawText
	 */
	public parse () {
		return {
			rawtext: this.rawstr
		} as RawText;
	}
	public combine (builder: RawtextBuilder) {
		this.rawstr = this.rawstr.concat(builder.rawstr);
		return this;
	}
	static directTra (key: string, ...args: string[]) {
		return { rawtext: [
			{
				translate: key,
				with: args,
			}
		]} as RawText;
	}
}
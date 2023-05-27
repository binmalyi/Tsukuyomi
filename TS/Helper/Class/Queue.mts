import { Collection, GuildBasedChannel, BaseChannel, Snowflake, RateLimitError, DiscordAPIError } from "discord.js";

export class Queue {
    private static _channels: Collection<Snowflake, GuildBasedChannel> = new Collection();
    private static _interval: ReturnType<typeof setInterval> | void;
    public static duration: number = 2000;

    public static async enqueue(item: typeof this._channels){
        return await new Promise((resolve, reject) => {
            !item.every((value, key) => typeof key === 'string' && value instanceof BaseChannel)
            ? reject(new TypeError('Expected: Collection<string, GuildChannel>'))
            : resolve((this._channels = this._channels.merge(item, x => ({keep: true, value: x}), y => ({keep: true, value: y}), (z) => ({keep: true, value: z}))).size);

            if (typeof this._interval === 'undefined') (console.log('initializing interval'), this._interval = setInterval(this._callback.bind(this), this.duration));
        });
    };

    private static async _callback(){
        if (this._channels.size > 0 && typeof this._interval !== 'undefined'){
            const result = await this._channels.first()!.delete().catch(error => error);
            console.log('IF: #1', `this._interval: ${this._interval}`);

            if (result instanceof RateLimitError){
                console.log('IF: #2');
                this._interval = clearInterval(this._interval);
                this.duration += result.timeToReset;
                this._interval = setInterval(this._callback.bind(this), this.duration);

            } else {
                this._channels.delete(this._channels.firstKey()!);
                if (result instanceof DiscordAPIError) this._interval = clearInterval(this._interval);
            };

        } else if (this._channels.size === 0 && typeof this._interval !== 'undefined') this._interval = clearInterval(this._interval);
    };
};
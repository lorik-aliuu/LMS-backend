using LMS.Application.ServiceInterfaces;
using Microsoft.Extensions.Configuration;
using StackExchange.Redis;
using System;
using System.Text.Json;
using System.Threading.Tasks;

namespace LMS.Infrastructure.Services
{
    public class RedisService : ICacheService
    {
        private readonly StackExchange.Redis.IConnectionMultiplexer _redis;
        private readonly StackExchange.Redis.IDatabase _database;
        private readonly string _instanceName;

        public RedisService(
            StackExchange.Redis.IConnectionMultiplexer redis,
            IConfiguration configuration)
        {
            _redis = redis ?? throw new ArgumentNullException(nameof(redis));
            _database = _redis.GetDatabase();
            _instanceName = configuration["Redis:InstanceName"] ?? string.Empty;
        }

        public async Task<T?> GetAsync<T>(string key) where T : class
        {
            var fullKey = $"{_instanceName}{key}";
            var value = await ((StackExchange.Redis.IDatabase)_database).StringGetAsync(fullKey);
            return value.IsNullOrEmpty ? null : JsonSerializer.Deserialize<T>(value);
        }

        public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null) where T : class
        {
            var fullKey = $"{_instanceName}{key}";
            var serialized = JsonSerializer.Serialize(value);

          
            await ((StackExchange.Redis.IDatabase)_database).StringSetAsync(
                key: fullKey,
                value: serialized,
                expiry: expiration,
                when: When.Always 
            );
        }

        public async Task RemoveByPatternAsync(string pattern)
        {
            var server = _redis.GetServer(_redis.GetEndPoints()[0]);
            foreach (var key in server.Keys(pattern: $"{_instanceName}{pattern}"))
            {
                await _database.KeyDeleteAsync(key);
            }
        }



        public async Task RemoveAsync(string key)
        {
            var fullKey = $"{_instanceName}{key}";
            await ((StackExchange.Redis.IDatabase)_database).KeyDeleteAsync(fullKey);
        }

        public async Task<bool> ExistsAsync(string key)
        {
            var fullKey = $"{_instanceName}{key}";
            return await ((StackExchange.Redis.IDatabase)_database).KeyExistsAsync(fullKey);
        }

        public async Task<long> IncrementAsync(string key, TimeSpan? expiration = null)
        {
            var fullKey = $"{_instanceName}{key}";
            var value = await ((StackExchange.Redis.IDatabase)_database).StringIncrementAsync(fullKey);

            if (expiration.HasValue && value == 1)
            {
                await ((StackExchange.Redis.IDatabase)_database).KeyExpireAsync(
                    key: fullKey,
                    expiry: expiration.Value
                );
            }

            return value;
        }

        public async Task<long> GetCounterAsync(string key)
        {
            var fullKey = $"{_instanceName}{key}";
            var value = await ((StackExchange.Redis.IDatabase)_database).StringGetAsync(fullKey);
            return value.IsNullOrEmpty ? 0 : (long)value;
        }
    }
}

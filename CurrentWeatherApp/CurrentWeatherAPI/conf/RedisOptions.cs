using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using StackExchange.Redis;

public class RedisConfSetup()
{

    public ConfigurationOptions SetupRedisConf(string connectionString)
    {
        ConfigurationOptions conf = new()
        {
            EndPoints = { connectionString },
            AbortOnConnectFail = false,
            // TODO setup a user here from inside the redis.conf file...
            /* User = "default",
            Password = "secret" */
            Ssl = true,
            SslProtocols = System.Security.Authentication.SslProtocols.Tls12
        };

        conf.CertificateSelection += delegate
        {
            // TODO - file path and password
            // NOTE - figure out how this is gonna work in production...
            return X509CertificateLoader.LoadPkcs12FromFile("/etc/redis/certs/redis_client.pfx", "secret");
        };

        conf.CertificateValidation += ValidateServerCertificate;

        return conf;
    }

    private bool ValidateServerCertificate(
        object sender,
        X509Certificate? certificate,
        X509Chain? chain,
        SslPolicyErrors sslPolicyErrors)
    {
        if (certificate == null)
        {
            return false;
        }
        // TODO - not sure if this function will work since it says it required .PEM file?
        // NOTE - Also should this service really have the server crt?
        var ca = X509CertificateLoader.LoadCertificateFromFile("/etc/redis/certs/ca_server.crt");
        bool verdict = (certificate.Issuer == ca.Subject);
        if (verdict)
        {
            return true;
        }
        Console.WriteLine("Certificate error: {0}", sslPolicyErrors);
        return false;
    }
}
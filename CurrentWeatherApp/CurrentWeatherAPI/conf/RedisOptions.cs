using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using StackExchange.Redis;

public class RedisConfSetup(ILogger<RedisConfSetup> logger, string serverPemPath)
{

    public ConfigurationOptions SetupRedisConf(string connectionString, string path, string password)
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
            // TODO - figure out how this is gonna work in production...
            return X509CertificateLoader.LoadPkcs12FromFile(path, password);
        };

        conf.CertificateValidation += ValidateServerCertificate;
        logger.LogInformation("Returning Redis Configuration...");
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
        var ca = X509CertificateLoader.LoadCertificateFromFile(serverPemPath);
        bool verdict = (certificate.Issuer == ca.Subject);
        if (verdict)
        {
            logger.LogInformation("Successful verdict, returning true.");
            return true;
        }
        Console.WriteLine("Certificate error: {0}", sslPolicyErrors);
        logger.LogInformation("Unsuccessful verdict, returning false.");
        return false;
    }
}
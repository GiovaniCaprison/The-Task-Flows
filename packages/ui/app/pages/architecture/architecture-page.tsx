import { FunctionComponent } from 'react';
import Box from '@mui/material/Box';

import { LinkableSection } from '../../components/linkable-section';
import { Markdown } from '../../components/markdown';
import { PageHeader } from '../../components/page-header';
import { PageSection } from '../../components/page-section';

export const ArchitecturePage: FunctionComponent = () => (
  <>
    <PageHeader />

    <PageSection>
      <Box alt='Architecture' component='img' src='/img/architecture.png' sx={{ margin: '25px 0', width: '100%' }} />
      <LinkableSection title='Introduction to the Architecture page and the TheTaskFlows Web-app'>
        <Markdown>
          I am aware that this will initially be read by someone likely visiting the website for the first time, so for both time-efficiency purposes and to save you all
          from a large amount of technical detail, I will do my very best to simplify/summarize TheTaskFlows Web-app architecture and Business Logic
          in the following sections, then provide answers to any questions you might have directly if you reach out to me via email louisgrennell@gmail.com. Please also note that every
          resource present in TheTaskFlows AWS infrastructure has X-Ray, CloudWatch, and CloudTrail enabled for monitoring and auditing.
          Lambda functions are also configured to emit RUM events to the RUM App Monitor, have Lambda Insights enabled, and CodeGuru Profiles configured.
          All of this is streamed to Glacier S3 Buckets for warehousing. The diagram which you are seeing now represents
          TheTaskFlows Web-app architecture, each element from the image is indexed with a corresponding description below. The entirety of the project&#39;s
          infrastructure has been built using CloudFormation which is deployed to the TheTaskFlows Master Account via a Git Pipeline. The build system bundles our code and
          IaC together i.e. the code which is used, for example, in the OpenAPI Lambda, is built and stored in a separate package, which is then defined as the
          source code for the Lambda function in it&#39;s CloudFormation stack stack.
        </Markdown>
      </LinkableSection>
      <LinkableSection title='1. Route 53 CloudFront Alias'>
        <Markdown>
          TheTaskFlows domain ([thetaskflows.com](https://thetaskflows.com/)) is an apex ([alias
          record](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/route-53-concepts.html#route-53-concepts-alias-resource-record-set))
          in our Route 53 [hosted
          zone](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/route-53-concepts.html#route-53-concepts-hosted-zone) that points
          at our [CloudFront distribution](https://aws.amazon.com/cloudfront/). The Route 53 hosted zone for **thetaskflows.com** has
          been delegated to us from purchasing the domain name via AWS. Delegation is the process by which the owner (Louis Grennell
          in this case) of a domain (**thetaskflows.com** in this case) routes traffic to our domain via adding records in their hosted zone
          that point all traffic for our domain (**thetaskflows.com**) at our Route 53 hosted zone&#39;s [name
          servers](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/route-53-concepts.html#route-53-concepts-name-servers) which
          house all the records for routing of traffic within our domain.
        </Markdown>
      </LinkableSection>
      <LinkableSection title='2. Global Firewall'>
        <Markdown>
          TheTaskFlows CloudFront distribution is configured to have AWS WAF (Web Application Firewall) filter out malicious requests
          bound for the website distribution. Included are AWS&#39;s [core rule
          set](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-baseline.html#aws-managed-rule-groups-baseline-crs),
          [known bad inputs rule
          set](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-baseline.html#aws-managed-rule-groups-baseline-known-bad-inputs),
          [Linux rule
          set](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-use-case.html#aws-managed-rule-groups-use-case-linux-os),
          and [IP reputation rule
          set](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-ip-rep.html#aws-managed-rule-groups-ip-rep-amazon).
        </Markdown>
      </LinkableSection>
      <LinkableSection title='3. Mote Interceptor Lambda@Edge Function'>
        <Markdown>
          TheTaskFlows has its [CloudFront distribution](https://aws.amazon.com/cloudfront/) set up to have all
          [viewer-requests](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-cloudfront-trigger-events.html)
          intercepted by the Mote Interceptor [Lambda@Edge function](https://aws.amazon.com/lambda/edge/) which ensures all callers are
          properly authenticated with Cognito before allowing access to the CloudFront distribution. If the user is not authenticated, the
          request will be short-circuited, and a redirect response to Cognito will be returned to the user so that they can authenticate
          themselves. The authentication logic is performed by the
          Mote Interceptor itself which is the recommended authentication logic for Lambda@Edge functions.
          This interceptor is also configured to [SigV4 sign](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) all
          **/api** requests. TheTaskFlows [API Gateway requires IAM
          authentication/authorization](https://docs.aws.amazon.com/apigateway/latest/developerguide/permissions.html) and the addition of
          the signature by this Lambda@Edge function is what allows users to be able to access the contents of this API. Note: Our Route 53
          hosted zone does **not** point traffic directly at this Lambda@Edge function. As previously mentioned, the Route 53 hosted zone
          points traffic at our CloudFront distribution, and we then have our CloudFront distribution configured to have this intercept
          viewer-requests which is not the same as direct traffic routing. There is no way to directly route traffic at Lambda@Edge
          functions.
        </Markdown>
      </LinkableSection>
      <LinkableSection title='4. CloudFront Distribution'>
        <Markdown>
          TheTaskFlows uses [CloudFront](https://aws.amazon.com/cloudfront/) as its content distribution network (CDN). TheTaskFlows
          CloudFront distribution serves a couple of purposes. First, CloudFront handles [TLS
          termination](https://en.wikipedia.org/wiki/TLS_termination_proxy) for the top level **thetaskflows.com** domain using the
          TLS/SSL certificate which is vended using [AWS Certificate Manager](https://aws.amazon.com/certificate-manager/). We verify
          ownership of this certificate using [DNS validation](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html)
          which basically entails adding a unique CNAME record in our Route 53 hosted zone that Certificate Manager will then ping to
          confirm that we own the domain before granting the certificate. Second, CloudFront has [cache
          behaviors](https://docs.aws.amazon.com/cloudfront/latest/APIReference/API_CacheBehavior.html) setup which manage both what
          [origins](https://docs.aws.amazon.com/cloudfront/latest/APIReference/API_Origin.html) specific request patterns route to and how
          to handle caching for that route. We utilize this feature to aggressively cache all of our static assets from S3 as well as use
          the routing policies in these behaviors to expose our API Gateway as a path under the apex domain to avoid
          [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). Lastly, we utilize the edge computing capabilities provided by
          CloudFront&#39;s [Lambda@Edge](https://aws.amazon.com/lambda/edge/) feature to provide authentication, request signing, and adding
          cache/security headers to assets for our website that enable us to operate the website securely across the globe.
        </Markdown>
      </LinkableSection>
      <LinkableSection title='5. Route 53 API Gateway Alias'>
        <Markdown>
          TheTaskFlows Route 53 [hosted
          zone](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/route-53-concepts.html#route-53-concepts-hosted-zone) contains an
          [alias
          record](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/route-53-concepts.html#route-53-concepts-alias-resource-record-set)
          for **api.thetaskflows.com** which points that record at our API Gateway&#39;s default domain URL. This allows our API
          Gateway to be accessed via **api.thetaskflows.com** opposed to the ugly, unique value that API Gateway typically defaults
          to. Note: this domain is never directly accessed via the UI. Instead, the use of IAM authentication on the API Gateway forces
          users to go through the CloudFront distribution which has the appropriate authentication and signing logic to make the API
          available via the **/api** path of the top level domain of the website.
        </Markdown>
      </LinkableSection>
      <LinkableSection title='6. Regionalized Firewall'>
        <Markdown>
          TheTaskFlows API Gateway is configured to have AWS WAF (Web Application Firewall) filter out malicious requests bound for
          the website distribution. Included are AWS&#39;s [core rule
          set](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-baseline.html#aws-managed-rule-groups-baseline-crs),
          [known bad inputs rule
          set](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-baseline.html#aws-managed-rule-groups-baseline-known-bad-inputs),
          [Linux rule
          set](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-use-case.html#aws-managed-rule-groups-use-case-linux-os),
          and [IP reputation rule
          set](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-ip-rep.html#aws-managed-rule-groups-ip-rep-amazon).
          This additional layer of safety is added to ensure the API is also shielded against any services communicating directly with the
          API.
        </Markdown>
      </LinkableSection>
      <LinkableSection title='7. API Gateway'>
        <Markdown>
          TheTaskFlows dynamic content is served via a public-facing [API Gateway](https://aws.amazon.com/api-gateway/). This API
          Gateway requires [IAM authentication/authorization](https://docs.aws.amazon.com/apigateway/latest/developerguide/permissions.html)
          which ensures that only requests which have passed through the Cognito-protected CloudFront distribution are allowed given only
          those requests will have the appropriate SigV4 headers attached which got added by the Mote Interceptor Lambda@Edge function. For
          TheTaskFlows default architecture, the API Gateway primarily serves as a secure proxy for the API Lambda function which is
          actually serves the request. Given this API Gateway is public facing and has IAM authentication/authorization, the API can be
          called directly by other services (both external and internal like canaries/integration tests) if they have been granted they have
          the the appropriate permissions via IAM policies.
        </Markdown>
      </LinkableSection>
      <LinkableSection title='8. API Lambda'>
        <Markdown>
          TheTaskFlows, by default, has its backend setup to resolve requests in a [Lambda function](https://aws.amazon.com/lambda/). These
          requested are resolved by a [tRPC](https://trpc.io/) server instance running in the Lambda function. tRPC has become one of the
          leading tools for developing full stack, type-safe applications by automatically managing client generation and integrating with
          other leading tools such as [React Query](https://tanstack.com/query/latest). Requesting coming to the lambda are encrypted using
          the public key of the [KMS](https://aws.amazon.com/kms/)-managed [asymmetric key
          pair](https://en.wikipedia.org/wiki/Public-key_cryptography). To decrypt the requests, the Lambda function will send a decrypt
          request to KMS which will return the decrypted response.
        </Markdown>
      </LinkableSection>
      <LinkableSection title='9. Client-Side Encryption Asymmetric Key Pair'>
        <Markdown>
          TheTaskFlows, by default, is configured to perform client-side encryption in the browser. What this means is that all requests are
          actually encrypted at the application layer which ensures any security vulnerabilities in all of the layers between the browser
          and the API Lambda such as a security issue of CloudFront not having encryption in transit between
          POPs do not affect the security posture of the applications. To achieve this,
          TheTaskFlows creates an asymmetric key pair using [KMS](https://aws.amazon.com/kms/), vends the public key portion of it using the
          public key Lambda function, encrypts the request in the browser, and after the request has made it all the way to the API lambda,
          we submit decrypt request to KMS.
        </Markdown>
      </LinkableSection>
      <LinkableSection title='10. TheTaskFlows Business Logic'>
        <Markdown>
          TheTaskFlows Business Logic is configured via a complex series of configurations ranging from AWS Services, to actual code and
          internal tooling. However, if you are interested in learning more, please see the next segment of this page for a full breakdown.
        </Markdown>
      </LinkableSection>
      <LinkableSection title='11. Public Key Lambda'>
        <Markdown>
          This Lambda function is responsible for getting the public key of the [KMS](https://aws.amazon.com/kms/)-managed [asymmetric key
          pair](https://en.wikipedia.org/wiki/Public-key_cryptography) that gets used in the browser for client-side encryption.
        </Markdown>
      </LinkableSection>
      <LinkableSection title='12. UI Asset S3 Bucket'>
        <Markdown>
          TheTaskFlows static assets (like the HTML, JavaScript, and CSS) are served via an S3 bucket. This S3 bucket is encrypted at
          rest and its access is protected with IAM. Only the CloudFront distribution is able to access the bucket using an [origin access
          identity](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html). With
          that, users are not able to access the assets without having first gone through Cognito authentication with the CloudFront
          distribution.
        </Markdown>
      </LinkableSection>
    </PageSection>
  </>
);

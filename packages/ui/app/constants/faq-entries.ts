import { ExternalLinks } from './external-links';
import { FAQEntry } from '../types/faq';

export const thetaskflowsFaqs: FAQEntry[] = [
  {
    question: 'What is TheTaskFlows?',
    answer:
      "TheTaskFlows is a powerful cloud based application that allows users to efficiently upload files through a scalable, secure, and easy-to-use interface. By submitting files or objects, users can leverage pre-configured protocols to upload their data without the need for manual intervention or infrastructure management. TheTaskFlows eliminates the complexity of configuring cloud environments, enabling users to focus on the management and analysis of their data. Whether you are organising complex information or saving small datasets, TheTaskFlows ensures that uploads are handled quickly and securely, allowing users to achieve their desired results in significantly less time then traditional cloud based storage solutions. The platform streamlines file uploads, providing a seamless experience that saves users hours of manual effort and configuration, boosting overall productivity and data-driven insights.",
  },
  {
    question: 'What is the expected cost of TheTaskFlows?',
    answer: `As with most cloud-based services, the cost of running TheTaskFlows varies depending on usage patterns. To estimate the cost, we would need to analyze how frequently users submit files and the size of those files. However, TheTaskFlows is designed with cost-efficiency in mind. Running the web app itself typically incurs minimal costs—usually less than $2 per month. The main expenses come from processing larger file uploading jobs or tasks that require more storage resources, especially if users are uploading significant datasets or running complex on the files which they have uploaded already. While file processing itself tends to be relatively inexpensive, users running large-scale operations may incur higher costs, particularly when using persistent database instances or cloud storage. Despite this, TheTaskFlows is optimized to reduce overhead and focus on performance, ensuring users spend more time executing tasks rather than configuring environments, leading to lower overall costs in terms of time and resources.`,
  },
  {
    question: 'Who owns TheTaskFlows?',
    answer:
      'TheTaskFlows is currently a proof of concept (POC) initiated in University whereby Louis Grennell and his colleagues at university had to create a project for one of their classes. At present, there is no official sponsor, and TheTaskFlows operates without formal support or a dedicated development queue typical of officially funded projects. Despite this, the project is intended to demonstrate the value of democratizing cloud storage, with the goal of showcasing its potential as a reliable tool for wider adoption within audiences who are less exposed to cloud technologies. The hope is that TheTaskFlows will evolve from its current POC status into a fully supported tool, delivering significant time-saving and information safety benefits to all.',
  },
  {
    question: 'I see this is a POC, what work is still remaining?',
    answer: `Right now, the core architecture of TheTaskFlows is set up and functional. However, before it can become a fully-fledged production ready tool, several areas need further development. Key requirements include ensuring compliance with security standards (e.g., implementing proper AppSec measures) to protect the integrity of file processing and data safety. Additionally, we need to improve the scalability of the platform, particularly for load balancing when retrieving high volumes of files, which could be a bottleneck in its current state. There are a few other rough edges, such as optimizing resource allocation and improving the file upload/retrieval queueing mechanism, that will need more time to refine before TheTaskFlows can be considered production-ready.`,
  },
  {
    question: 'How can I get involved?',
    answer: `The easiest way to get involved with TheTaskFlows is to share insights or suggestions via email. If you'd like to dive deeper, you can also submit code reviews for any changes or improvements you'd like to see. Feel free to reach out to the current lead maintainer, louisgrennell@gmail.com, who can provide guidance on contributing to the project code.`,
  },
  {
    question: 'Where can I go to for support or questions?',
    answer: `For any support or questions regarding TheTaskFlows, please reach out to the current lead maintainer via email louisgrennell@gmail.com`,
  },
];

export const developmentFaqs: FAQEntry[] = [
  {
    question: 'Why TypeScript?',
    answer: `JavaScript is the primary programing language for the web with near universal support among browsers as the primary way to provide client-side programmability of applications. However, JavaScript alone tends to be a pain to write in for a lot of developers primarily due its dynamic typing and the lack of basic build-time assurances that your code is correct. This is where TypeScript steps in.\n\n [TypeScript](https://www.typescriptlang.org/) is an open-source statically-typed superset of JavaScript which adds static type definitions and type inference and has become one of the most popular ways to write JavaScript. All valid JavaScript is also TypeScript given TypeScript is simply a superset of JavaScript that allows you to annotate your code with types. Both the types you explicitly add as well as the native type inference in TypeScript speed up the development process by providing guarantees of the type and structure of the variables you are working with early in the development process to prevent "dumb" mistakes like accessing properties that do not exist. With all of that, TypeScript made the most sense to to write the user interface in.\n\nIn order to provide a consistent development experience across all aspects of the website, TypeScript is also used for the backend as well as defining the web-app's infrastructure in CDK. CDK itself is also written in TypeScript causing it to have the best support among its supported languages making TypeScript the natural best language to write CDK-managed infrastructure in further hardening the reason for TypeScript being the language the entire website is written in.`,
  },
  {
    question: 'Why tRPC opposed to GraphQl?',
    answer:
      'GraphQL is a query language for APIs that enables declarative data fetching in order to give the client the power to specify exactly the data that is needed. However, GraphQl has a relatively steep learning curve, relatively poor integration with other external data sources given nearly all data sources have REST-ful APIs, and has relatively poor TypeScript level type safety for most GraphQL clients. TheTaskFlows instead defaults to using [tRPC](https://trpc.io/) which provides a similar client experience to GraphQL (event adopting GraphQL\'s "query" and "mutation" lexicon), but enacts it in a much more familiar, REST-ful pattern that integrates better with other data sources.',
  },
  {
    question: 'Why a Lerna monorepo opposed to separate code packages?',
    answer:
      'Using a Lerna monorepo allows for the full stack website to be managed more easily than having a bunch of separate code packages while also ensuring a consistent development experience no matter which part of the website is being worked on. Consistent development experiences for the full stack helps prevent knowledge soiling that so often occurs between frontend and backend development.',
  },
];

export const architectureFaqs: FAQEntry[] = [
  {
    question: 'What is Lambda@Edge?',
    answer:
      'Regular Lambda is a serverless code execution platform that runs in a specific region in response to triggers like from API Gateway. Lambda@Edge, on the other hand, is a globally distributed Lambda function that executes in the AWS edge data centers that exclusively responds to CloudFront events. Lambda@Edge functions are specifically trailered to perform lightweight logic such as routing, signing, header manipulation, etc and have more strict limits (like 5s durations) that prevent them from doing more heavy or complex tasks that typical Lambdas would be able to handle. Lambda@Edge function are only able to be launched in **us-east-1** (i.e. **IAD**) while regular Lambda functions can operate in every region. Lambda@Edge functions also have their logs sent to the closest region to where the CloudFront event occurred opposed to where the Lambda was deployed.',
  },
  {
    question: 'Can we swap out the backend compute type?',
    answer:
      'The short answer is yes, of course! We would basically remove the API Lambda code and then wire up whatever compute we want to the API Gateway in place of the default API Lambda. However, I do not recommend this because the code for your service would need to be mastered in a different language and package which yields an inconsistent development experience for this part of the project and unnecessary added complexity. It also sets us up to have to reimplement a lot of the features that come with TheTaskFlows like end-to-end encryption and the entire client/server relationship that tRPC manages forcing us to then figure out how to setup a cross-language schema using tools like [Smithy](https://smithy.io).',
  },
  {
    question: `How does TheTaskFlows scale and what are it's known bottlenecks?`,
    answer:
      "Overall, the only bottleneck which impacts TheTaskFlows is that of compute supply. This is something which we will aim to improve in the future given the time constraints of the project in it's current state. However, it should be noted that the fixes which would be implemented to omit this scaling limit are straightforward and known, it is simply a matter of time which prevents me from doing so. As far as the web-app architecture is concerned though, TheTaskFlows is fully serverless and could easily handle the combined load of all 100,000\'s of users at once",
  },
];

export const securityFaqs: FAQEntry[] = [
  {
    question: 'How does this architecture provide CSRF protection?',
    answer:
      "CSRF (cross-site request forgery) is a common web vulnerability which involves a malicious actor fooling a web application into allowing them to perform sensitive operations (which they should not be have permission to) on behalf of legitimate, authenticated users. For our website's architecture, the JWT provided by Cognito is the primary means of authentication. With that, the attacker would need to be able to have access to and include that Token in their illegitimate requests. The NodeJS-MoteInterceptor, by default, prevents this by setting the [SameSite](https://web.dev/samesite-cookies-explained/) attribute on the authentication cookie to **Lax** which tells the browser to not send the cookie for cross-site requests and to only include it on or when navigating to the website. With this, attackers are unable to have access to the cookie in their cross-site requests and their requests will therefore fail authentication. The usage of the **SameSite** cookie attribute is likely sufficient protection.",
  },
  {
    question: 'How does this architecture provide XSS protection?',
    answer:
      "Cross-site scripting (XSS) is the unintended execution of untrusted code in a user's browser that typically occurs when an attacker injects malicious code in places that require user input. TheTaskFlows' user interface, by default, uses [React](https://reactjs.org/) which automatically escapes user input to avoid many of the most common forms of XSS as discussed [here](https://stackoverflow.com/q/33644499). Along with this, TheTaskFlows has a Lambda@Edge function configured to intercept origin responses from S3 to automatically add cache-control and security headers to the website's static assets. Included in these security headers is the [**X-XSS-Protection**](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection) and [**Content-Security-Policy**](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) headers which also help safeguard against XSS attacks.",
  },
  {
    question: 'How is the API Gateway protected?',
    answer:
      'The API Gateway requires IAM permissions in order to invoke the API. IAM uses [AWS Signature V4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html) for authentication which is the primary authentication mechanism that AWS uses across almost all of their services. The signature for authentication is added by a [Lambda@Edge](https://aws.amazon.com/lambda/edge/) function configured to intercept [origin requests](https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html) that are en route to the API Gateway. These requests have already passed through the JWT authentication Lambda@Edge function and are therefore already authenticated to be from authenticated users. Any request that attempts to access the API Gateway directly via its public facing endpoint will not have the appropriate signature and will be unable to invoke the API.',
  },
];

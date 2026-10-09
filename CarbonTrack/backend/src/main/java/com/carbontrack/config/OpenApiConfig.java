package com.carbontrack.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI carbonTrackOpenAPI() {
        final String securitySchemeName = "bearerAuth";
        return new OpenAPI()
                .info(new Info()
                        .title("CarbonTrack REST API")
                        .description("REST API for Carbon Footprint Calculation and Tracking with verified emission factors from IPCC, CEA India, and UK DESNZ.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("CarbonTrack Engineering")
                                .email("info@carbontrack.org")
                                .url("https://carbontrack.org"))
                        .license(new License().name("Apache 2.0").url("https://www.apache.org/licenses/LICENSE-2.0")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter your JWT token generated upon login/registration.")));
    }
}
